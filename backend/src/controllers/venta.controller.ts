import { Request, Response } from "express";
import { Venta, Cliente, Entidad, TipoCliente, Estado, DetalleVenta, Producto, VentaHasFormaPago, FormaPago, BodegaHasProducto, Bodega } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { VentaSchema } from "../schemas/venta.schema.js";
import sequelize from "../config/sequelize.js";
import { Op, QueryTypes } from "sequelize";
import { ESTADOS_VENTA } from "../types/estadosDictionary.type.js";
import {
  restaurarInventario,
  reducirInventario,
  validarTotalesVenta,
  calcularTotalFormasPago,
  calcularTotalDetalles,
  esVentaModificable,
  generarQueryEstadisticas
} from "../helpers/ventaController.helper.js";

const create = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { detallesVenta, formasPago, ...ventaData } = req.body;
    const userId = req.user?.id || 0;

    // Validación Zod de los datos de la venta
    const parseResult = VentaSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(ventaData);
    if (!parseResult.success) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Error de validación: ${parseResult.error.issues
            .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
            .join(", ")}`,
          userId,
        })
      );
    }

    // Validaciones de negocio
    if (!detallesVenta || !Array.isArray(detallesVenta) || detallesVenta.length === 0) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "Los detalles de venta son obligatorios",
          userId,
        })
      );
    }

    if (!formasPago || !Array.isArray(formasPago) || formasPago.length === 0) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "Las formas de pago son obligatorias",
          userId,
        })
      );
    }

    // Validar totales usando las funciones helper
    const totalFormasPago = calcularTotalFormasPago(formasPago);
    const totalDetalles = calcularTotalDetalles(detallesVenta);
    const validacion = validarTotalesVenta(totalFormasPago, totalDetalles, parseResult.data.totalVenta);

    if (!validacion.esValido) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: validacion.errores.join(', '),
          userId,
        })
      );
    }

    // Verificar que el cliente existe
    const cliente = await Cliente.findByPk(parseResult.data.clienteId);
    if (!cliente) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Cliente con ID ${parseResult.data.clienteId} no encontrado`,
          userId,
        })
      );
    }

    // Verificar que la bodega existe
    const bodega = await Bodega.findByPk(parseResult.data.bodegaId);
    if (!bodega) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Bodega con ID ${parseResult.data.bodegaId} no encontrada`,
          userId,
        })
      );
    }

    // 1️⃣ Crear la Venta
    const nuevaVenta = await Venta.create({ 
      ...parseResult.data, 
      estadoId: parseResult.data.estadoId || ESTADOS_VENTA.PENDIENTE 
    }, { transaction: t });

    // 2️⃣ Verificar existencias antes de crear los detalles
    for (const detalle of detallesVenta) {
      // Validar que cantidadVenta sea positiva
      if (!detalle.cantidadVenta || detalle.cantidadVenta <= 0) {
        throw new Error(`La cantidad de venta debe ser mayor a 0 para el producto ID ${detalle.productoId}`);
      }

      const producto = await Producto.findByPk(detalle.productoId);
      if (!producto) {
        throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
      }

      // Verificar existencia en la bodega específica
      const bodegaProducto = await BodegaHasProducto.findOne({
        where: { 
          productoId: detalle.productoId, 
          bodegaId: parseResult.data.bodegaId 
        },
        transaction: t
      });

      if (!bodegaProducto) {
        throw new Error(`Producto ${producto.descripcionProducto} no está disponible en la bodega ${bodega.descripcionBodega}`);
      }

      const existenciaEnBodega = bodegaProducto.existencia || 0;
      if (existenciaEnBodega < detalle.cantidadVenta) {
        throw new Error(`Stock insuficiente en bodega ${bodega.descripcionBodega} para el producto ${producto.descripcionProducto}. Disponible: ${existenciaEnBodega}, Solicitado: ${detalle.cantidadVenta}`);
      }

      // Verificar también existencia total (por seguridad)
      if (producto.totalExistenciaProducto < detalle.cantidadVenta) {
        throw new Error(`Stock total insuficiente para el producto ${producto.descripcionProducto}. Disponible: ${producto.totalExistenciaProducto}, Solicitado: ${detalle.cantidadVenta}`);
      }
    }

    // 3️⃣ Crear detalles de venta
    const detallesConVentaId = detallesVenta.map((detalle: any) => ({
      ...detalle,
      ventaId: nuevaVenta.id,
    }));
    await DetalleVenta.bulkCreate(detallesConVentaId, { transaction: t });

    // 4️⃣ Reducir existencias usando función helper
    await reducirInventario(
      detallesVenta,
      parseResult.data.bodegaId,
      t,
      BodegaHasProducto.decrement.bind(BodegaHasProducto),
      Producto.decrement.bind(Producto)
    );

    // 5️⃣ Crear las Formas de Pago
    const formasPagoConVentaId = formasPago.map((forma: any) => ({
      ...forma,
      ventaId: nuevaVenta.id,
    }));
    await VentaHasFormaPago.bulkCreate(formasPagoConVentaId, { transaction: t });

    await t.commit();

    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Venta creada exitosamente",
        shouldSaveLog: true,
        userId,
        genericId: nuevaVenta.id.toString(),
      })
    );
  } catch (error) {
    await t.rollback();
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error creando venta: ${typeof error === "string" ? error : (error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || 0;
  const t = await sequelize.transaction();

  try {
    const { detallesVenta, formasPago, ...ventaData } = req.body;

    // Obtener la venta actual para conocer la bodega original
    const ventaActual = await Venta.findByPk(id, { transaction: t });
    if (!ventaActual) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Venta con ID ${id} no encontrada`,
          userId,
          genericId: id,
        })
      );
    }

    // Verificar si la venta es modificable
    if (!esVentaModificable(ventaActual.estadoId)) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "No se puede modificar una venta cancelada",
          userId,
          genericId: id,
        })
      );
    }

    // Validación Zod de los datos de la venta
    const parseResult = VentaSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(ventaData);
    if (!parseResult.success) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Error de validación: ${parseResult.error.issues
            .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
            .join(", ")}`,
          userId,
          genericId: id,
        })
      );
    }

    // Si se cambia la bodega, verificar que existe
    if (parseResult.data.bodegaId && parseResult.data.bodegaId !== ventaActual.bodegaId) {
      const bodega = await Bodega.findByPk(parseResult.data.bodegaId);
      if (!bodega) {
        await t.rollback();
        return res.status(400).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: `Bodega con ID ${parseResult.data.bodegaId} no encontrada`,
            userId,
            genericId: id,
          })
        );
      }
    }

    // Validar totales si se proporcionan nuevos detalles
    if (detallesVenta && Array.isArray(detallesVenta) && formasPago && Array.isArray(formasPago)) {
      const totalFormasPago = calcularTotalFormasPago(formasPago);
      const totalDetalles = calcularTotalDetalles(detallesVenta);
      const validacion = validarTotalesVenta(totalFormasPago, totalDetalles, parseResult.data.totalVenta);

      if (!validacion.esValido) {
        await t.rollback();
        return res.status(400).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: validacion.errores.join(', '),
            userId,
            genericId: id,
          })
        );
      }
    }

    // Actualizar la venta
    const [updatedRows] = await Venta.update(parseResult.data, { where: { id }, transaction: t });
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Venta con ID ${id} no encontrada para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    // Si se proporcionaron nuevos detalles, reemplazar los existentes
    if (detallesVenta && Array.isArray(detallesVenta)) {
      // Primero restaurar las existencias de los detalles antiguos
      const detallesAntiguos = await DetalleVenta.findAll({ 
        where: { ventaId: id }, 
        transaction: t 
      });
      
      await restaurarInventario(
        detallesAntiguos,
        ventaActual.bodegaId,
        t,
        BodegaHasProducto.increment.bind(BodegaHasProducto),
        Producto.increment.bind(Producto)
      );

      // Eliminar detalles antiguos
      await DetalleVenta.destroy({ where: { ventaId: id }, transaction: t });

      // Verificar existencias para los nuevos detalles en la nueva bodega
      const nuevaBodegaId = parseResult.data.bodegaId || ventaActual.bodegaId;
      for (const detalle of detallesVenta) {
        if (!detalle.cantidadVenta || detalle.cantidadVenta <= 0) {
          throw new Error(`La cantidad de venta debe ser mayor a 0 para el producto ID ${detalle.productoId}`);
        }

        const producto = await Producto.findByPk(detalle.productoId);
        if (!producto) {
          throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
        }

        const bodegaProducto = await BodegaHasProducto.findOne({
          where: { 
            productoId: detalle.productoId, 
            bodegaId: nuevaBodegaId 
          },
          transaction: t
        });

        if (!bodegaProducto) {
          throw new Error(`Producto ${producto.descripcionProducto} no encontrado en la bodega especificada`);
        }

        const existenciaEnBodega = bodegaProducto.existencia || 0;
        if (existenciaEnBodega < detalle.cantidadVenta) {
          throw new Error(`Stock insuficiente en bodega para el producto ${producto.descripcionProducto}. Disponible: ${existenciaEnBodega}, Solicitado: ${detalle.cantidadVenta}`);
        }
      }

      // Crear nuevos detalles
      const detallesConVentaId = detallesVenta.map((detalle: any) => ({
        ...detalle,
        ventaId: id,
      }));
      await DetalleVenta.bulkCreate(detallesConVentaId, { transaction: t });

      // Reducir existencias con los nuevos detalles
      await reducirInventario(
        detallesVenta,
        nuevaBodegaId,
        t,
        BodegaHasProducto.decrement.bind(BodegaHasProducto),
        Producto.decrement.bind(Producto)
      );
    }

    // Si se proporcionaron nuevas formas de pago, reemplazar las existentes
    if (formasPago && Array.isArray(formasPago)) {
      await VentaHasFormaPago.destroy({ where: { ventaId: id }, transaction: t });
      const formasPagoConVentaId = formasPago.map((forma: any) => ({
        ...forma,
        ventaId: id,
      }));
      await VentaHasFormaPago.bulkCreate(formasPagoConVentaId, { transaction: t });
    }

    await t.commit();

    const updatedVenta = await Venta.findByPk(id, {
      include: [
        { 
          model: Cliente, 
          as: "cliente", 
          include: [
            { model: Entidad, as: "entidad" }, 
            { model: TipoCliente, as: "tipoCliente" }
          ] 
        },
        { model: Estado, as: "estado" },
        { model: Bodega, as: "bodega" },
        { 
          model: DetalleVenta, 
          as: "detallesVenta", 
          include: [{ model: Producto, as: "producto" }] 
        },
        { 
          model: VentaHasFormaPago, 
          as: "formasPagoVenta", 
          include: [{ model: FormaPago, as: "formaPago" }] 
        },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Venta actualizada exitosamente`,
        userId,
        genericId: id,
        shouldSaveLog: true,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando venta: ${id} - ${(error as Error).message}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

const partialUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || 0;
  const t = await sequelize.transaction();

  try {
    const { detallesVenta, formasPago, ...ventaData } = req.body;

    // Verificar que la venta existe
    const ventaExistente = await Venta.findByPk(id, { transaction: t });
    if (!ventaExistente) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Venta con ID ${id} no encontrada`,
          userId,
          genericId: id,
        })
      );
    }

    // Verificar si la venta es modificable
    if (!esVentaModificable(ventaExistente.estadoId)) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "No se puede modificar una venta cancelada",
          userId,
          genericId: id,
        })
      );
    }

    // Actualizar la venta si hay datos
    if (Object.keys(ventaData).length > 0) {
      // Si se está cambiando la bodega, verificar que existe
      if (ventaData.bodegaId && ventaData.bodegaId !== ventaExistente.bodegaId) {
        const bodega = await Bodega.findByPk(ventaData.bodegaId);
        if (!bodega) {
          await t.rollback();
          return res.status(400).json(
            await errorAndLogHandler({
              level: errorLevels.warn,
              message: `Bodega con ID ${ventaData.bodegaId} no encontrada`,
              userId,
              genericId: id,
            })
          );
        }
      }

      // Si se está cambiando el cliente, verificar que existe
      if (ventaData.clienteId && ventaData.clienteId !== ventaExistente.clienteId) {
        const cliente = await Cliente.findByPk(ventaData.clienteId);
        if (!cliente) {
          await t.rollback();
          return res.status(400).json(
            await errorAndLogHandler({
              level: errorLevels.warn,
              message: `Cliente con ID ${ventaData.clienteId} no encontrado`,
              userId,
              genericId: id,
            })
          );
        }
      }

      const [updatedRows] = await Venta.update(ventaData, { where: { id }, transaction: t });
      if (updatedRows === 0) {
        await t.rollback();
        return res.status(404).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: `Venta con ID ${id} no encontrada para actualización parcial`,
            userId,
            genericId: id,
          })
        );
      }
    }

    // Manejar detalles si se proporcionan
    if (detallesVenta && Array.isArray(detallesVenta)) {
      // Obtener la bodega actual (puede haber cambiado en esta misma operación)
      const bodegaActual = ventaData.bodegaId || ventaExistente.bodegaId;

      // Restaurar existencias de detalles antiguos
      const detallesAntiguos = await DetalleVenta.findAll({ 
        where: { ventaId: id },
        transaction: t
      });
      
      await restaurarInventario(
        detallesAntiguos,
        ventaExistente.bodegaId, // Usar bodega original
        t,
        BodegaHasProducto.increment.bind(BodegaHasProducto),
        Producto.increment.bind(Producto)
      );

      // Eliminar detalles antiguos
      await DetalleVenta.destroy({ where: { ventaId: id }, transaction: t });

      // Verificar existencias para los nuevos detalles
      for (const detalle of detallesVenta) {
        if (!detalle.cantidadVenta || detalle.cantidadVenta <= 0) {
          throw new Error(`La cantidad de venta debe ser mayor a 0 para el producto ID ${detalle.productoId}`);
        }

        const producto = await Producto.findByPk(detalle.productoId);
        if (!producto) {
          throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
        }

        // Verificar existencia en la bodega (actual, que puede haber cambiado)
        const bodegaProducto = await BodegaHasProducto.findOne({
          where: { 
            productoId: detalle.productoId, 
            bodegaId: bodegaActual 
          },
          transaction: t
        });

        if (!bodegaProducto) {
          throw new Error(`Producto ${producto.descripcionProducto} no está disponible en la bodega especificada`);
        }

        const existenciaEnBodega = bodegaProducto.existencia || 0;
        if (existenciaEnBodega < detalle.cantidadVenta) {
          throw new Error(`Stock insuficiente en bodega para el producto ${producto.descripcionProducto}. Disponible: ${existenciaEnBodega}, Solicitado: ${detalle.cantidadVenta}`);
        }

        if (producto.totalExistenciaProducto < detalle.cantidadVenta) {
          throw new Error(`Stock total insuficiente para el producto ${producto.descripcionProducto}. Disponible: ${producto.totalExistenciaProducto}, Solicitado: ${detalle.cantidadVenta}`);
        }
      }

      // Crear nuevos detalles
      const detallesConVentaId = detallesVenta.map((detalle: any) => ({
        ...detalle,
        ventaId: id,
      }));
      await DetalleVenta.bulkCreate(detallesConVentaId, { transaction: t });

      // Reducir existencias con los nuevos detalles en la bodega actual
      await reducirInventario(
        detallesVenta,
        bodegaActual,
        t,
        BodegaHasProducto.decrement.bind(BodegaHasProducto),
        Producto.decrement.bind(Producto)
      );
    }

    // Manejar formas de pago si se proporcionan
    if (formasPago && Array.isArray(formasPago)) {
      await VentaHasFormaPago.destroy({ where: { ventaId: id }, transaction: t });
      const formasPagoConVentaId = formasPago.map((forma: any) => ({
        ...forma,
        ventaId: id,
      }));
      await VentaHasFormaPago.bulkCreate(formasPagoConVentaId, { transaction: t });
    }

    await t.commit();

    const updatedVenta = await Venta.findByPk(id, {
      include: [
        { 
          model: Cliente, 
          as: "cliente", 
          include: [
            { model: Entidad, as: "entidad" }, 
            { model: TipoCliente, as: "tipoCliente" }
          ] 
        },
        { model: Estado, as: "estado" },
        { model: Bodega, as: "bodega" },
        { 
          model: DetalleVenta, 
          as: "detallesVenta", 
          include: [{ model: Producto, as: "producto" }] 
        },
        { 
          model: VentaHasFormaPago, 
          as: "formasPagoVenta", 
          include: [{ model: FormaPago, as: "formaPago" }] 
        },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Venta actualizada parcialmente exitosamente`,
        userId,
        genericId: id,
        shouldSaveLog: true,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando venta parcialmente: ${id} - ${(error as Error).message}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        {
          model: Cliente,
          as: "cliente",
          include: [
            {
              model: Entidad,
              as: "entidad",
            },
            {
              model: TipoCliente,
              as: "tipoCliente",
            },
          ],
        },
        {
          model: Estado,
          as: "estado",
        },
        {
          model: Bodega,
          as: "bodega",
        },
        {
          model: DetalleVenta,
          as: "detallesVenta",
          include: [
            {
              model: Producto,
              as: "producto",
            },
          ],
        },
        {
          model: VentaHasFormaPago,
          as: "formasPagoVenta",
          include: [
            {
              model: FormaPago,
              as: "formaPago",
            },
          ],
        },
      ],
      order: [["fechaVenta", "DESC"]],
    });

    return res.status(200).json({ success: ventas.length > 0, data: ventas });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo ventas: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: "cliente",
          include: [
            {
              model: Entidad,
              as: "entidad",
            },
            {
              model: TipoCliente,
              as: "tipoCliente",
            },
          ],
        },
        {
          model: Estado,
          as: "estado",
        },
        {
          model: Bodega,
          as: "bodega",
        },
        {
          model: DetalleVenta,
          as: "detallesVenta",
          include: [
            {
              model: Producto,
              as: "producto",
            },
          ],
        },
        {
          model: VentaHasFormaPago,
          as: "formasPagoVenta",
          include: [
            {
              model: FormaPago,
              as: "formaPago",
            },
          ],
        },
      ],
    });

    res.status(200).json({ success: venta !== null, data: venta });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo la venta: ${id} ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
        genericId: id,
      })
    );
  }
};

const cancelar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || 0;
  const t = await sequelize.transaction();

  try {
    // Verificar que la venta existe y obtener sus detalles
    const venta = await Venta.findByPk(id, {
      include: [
        {
          model: DetalleVenta,
          as: "detallesVenta", // Usar el alias correcto
        }
      ],
      transaction: t
    });

    if (!venta) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Venta con ID ${id} no encontrada`,
          userId,
          genericId: id,
        })
      );
    }

    // Verificar que la venta no esté ya cancelada
    if (venta.estadoId === ESTADOS_VENTA.CANCELADA) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `La venta ${id} ya está cancelada`,
          userId,
          genericId: id,
        })
      );
    }

    // Restaurar existencias usando función helper
    await restaurarInventario(
      venta.detalleVenta, 
      venta.bodegaId,
      t,
      BodegaHasProducto.increment.bind(BodegaHasProducto),
      Producto.increment.bind(Producto)
    );

    // Cambiar estado a cancelado
    await Venta.update(
      { estadoId: ESTADOS_VENTA.CANCELADA },
      { where: { id }, transaction: t }
    );

    await t.commit();

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Venta ${id} cancelada exitosamente`,
        userId,
        genericId: id,
        shouldSaveLog: true,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error cancelando venta: ${id} - ${(error as Error).message}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

const getByCliente = async (req: Request, res: Response) => {
  const { clienteId } = req.params;
  try {
    const ventas = await Venta.findAll({
      where: { clienteId },
      include: [
        {
          model: Cliente,
          as: "cliente",
          include: [
            { model: Entidad, as: "entidad" },
            { model: TipoCliente, as: "tipoCliente" },
          ],
        },
        { model: Estado, as: "estado" },
        { model: Bodega, as: "bodega" },
        {
          model: DetalleVenta,
          as: "detallesVenta",
          include: [{ model: Producto, as: "producto" }],
        },
        {
          model: VentaHasFormaPago,
          as: "formasPagoVenta",
          include: [{ model: FormaPago, as: "formaPago" }],
        },
      ],
      order: [["fechaVenta", "DESC"]],
    });

    res.status(200).json({ success: ventas.length > 0, data: ventas });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo ventas del cliente ${clienteId}: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
        genericId: clienteId,
      })
    );
  }
};

const getByDateRange = async (req: Request, res: Response) => {
  const { fechaInicio, fechaFin } = req.query;
  
  try {
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "Las fechas de inicio y fin son requeridas",
          userId: req.user?.id || 0,
        })
      );
    }

    const ventas = await Venta.findAll({
      where: {
        fechaVenta: {
          [Op.between]: [new Date(fechaInicio as string), new Date(fechaFin as string)]
        }
      },
      include: [
        {
          model: Cliente,
          as: "cliente",
          include: [
            { model: Entidad, as: "entidad" },
            { model: TipoCliente, as: "tipoCliente" },
          ],
        },
        { model: Estado, as: "estado" },
        { model: Bodega, as: "bodega" },
        {
          model: DetalleVenta,
          as: "detallesVenta",
          include: [{ model: Producto, as: "producto" }],
        },
      ],
      order: [["fechaVenta", "DESC"]],
    });

    res.status(200).json({ success: ventas.length > 0, data: ventas });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo ventas por rango de fechas: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getEstadisticas = async (req: Request, res: Response) => {
  try {
    const { query, replacements } = generarQueryEstadisticas(30);
    
    const estadisticas = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    res.status(200).json({ success: true, data: estadisticas });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo estadísticas de ventas: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

export const VentaController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
  cancelar,
  getByCliente,
  getByDateRange,
  getEstadisticas,
};