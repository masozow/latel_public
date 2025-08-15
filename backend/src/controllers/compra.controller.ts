import { Request, Response } from "express";
import { Compra, Proveedor, Entidad, Estado, DetalleCompra, Producto, CompraHasFormaPago, FormaPago, BodegaHasProducto, Bodega } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { CompraSchema } from "../schemas/compra.schema.js";
import sequelize from "../config/sequelize.js";
import { Op, QueryTypes } from "sequelize";
import { ESTADOS_COMPRA } from "../types/estadosDictionary.type.js";
import {
  incrementarInventario,
  reducirInventarioCompra,
  validarTotalesCompra,
  calcularTotalFormasPagoCompra,
  calcularTotalDetallesCompra,
  esCompraModificable,
  verificarProductoEnBodega,
  crearEntradaBodegaSiNoExiste,
  generarQueryEstadisticasCompra
} from "../helpers/compraController.helper.js";

const create = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { detallesCompra, formasPago, ...compraData } = req.body;
    const userId = req.user?.id || 0;

    // Validación Zod de los datos de la compra
    const parseResult = CompraSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(compraData);
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
    if (!detallesCompra || !Array.isArray(detallesCompra) || detallesCompra.length === 0) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "Los detalles de compra son obligatorios",
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
    const totalFormasPago = calcularTotalFormasPagoCompra(formasPago);
    const totalDetalles = calcularTotalDetallesCompra(detallesCompra);
    const validacion = validarTotalesCompra(totalFormasPago, totalDetalles, parseResult.data.totalCompra);

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

    // Verificar que el proveedor existe
    const proveedor = await Proveedor.findByPk(parseResult.data.proveedorId);
    if (!proveedor) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Proveedor con ID ${parseResult.data.proveedorId} no encontrado`,
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

    // 1️⃣ Crear la Compra
    const nuevaCompra = await Compra.create({ 
      ...parseResult.data, 
      estadoId: parseResult.data.estadoId || ESTADOS_COMPRA.PENDIENTE 
    }, { transaction: t });

    // 2️⃣ Verificar productos y cantidades antes de crear los detalles
    for (const detalle of detallesCompra) {
      // Validar que cantidadCompra sea positiva
      if (!detalle.cantidadCompra || detalle.cantidadCompra <= 0) {
        throw new Error(`La cantidad de compra debe ser mayor a 0 para el producto ID ${detalle.productoId}`);
      }

      const producto = await Producto.findByPk(detalle.productoId);
      if (!producto) {
        throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
      }

      // Verificar si el producto existe en la bodega, si no, crear la entrada
      const { existe } = await verificarProductoEnBodega(
        detalle.productoId,
        parseResult.data.bodegaId,
        BodegaHasProducto.findOne.bind(BodegaHasProducto),
        t
      );

      if (!existe) {
        await crearEntradaBodegaSiNoExiste(
          detalle.productoId,
          parseResult.data.bodegaId,
          0, // Existencia inicial 0, se incrementará después
          BodegaHasProducto.create.bind(BodegaHasProducto),
          t
        );
      }
    }

    // 3️⃣ Crear detalles de compra
    const detallesConCompraId = detallesCompra.map((detalle: any) => ({
      ...detalle,
      compraId: nuevaCompra.id,
    }));
    await DetalleCompra.bulkCreate(detallesConCompraId, { transaction: t });

    // 4️⃣ Incrementar existencias usando función helper
    await incrementarInventario(
      detallesCompra,
      parseResult.data.bodegaId,
      t,
      BodegaHasProducto.increment.bind(BodegaHasProducto),
      Producto.increment.bind(Producto)
    );

    // 5️⃣ Crear las Formas de Pago
    const formasPagoConCompraId = formasPago.map((forma: any) => ({
      ...forma,
      compraId: nuevaCompra.id,
    }));
    await CompraHasFormaPago.bulkCreate(formasPagoConCompraId, { transaction: t });

    await t.commit();

    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Compra creada exitosamente",
        shouldSaveLog: true,
        userId,
        genericId: nuevaCompra.id.toString(),
      })
    );
  } catch (error) {
    await t.rollback();
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error creando compra: ${typeof error === "string" ? error : (error as Error).message}`,
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
    const { detallesCompra, formasPago, ...compraData } = req.body;

    // Obtener la compra actual para conocer la bodega original
    const compraActual = await Compra.findByPk(id, { transaction: t });
    if (!compraActual) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Compra con ID ${id} no encontrada`,
          userId,
          genericId: id,
        })
      );
    }

    // Verificar si la compra es modificable
    if (!esCompraModificable(compraActual.estadoId)) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "No se puede modificar una compra cancelada",
          userId,
          genericId: id,
        })
      );
    }

    // Validación Zod de los datos de la compra
    const parseResult = CompraSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(compraData);
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
    if (parseResult.data.bodegaId && parseResult.data.bodegaId !== compraActual.bodegaId) {
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
    if (detallesCompra && Array.isArray(detallesCompra) && formasPago && Array.isArray(formasPago)) {
      const totalFormasPago = calcularTotalFormasPagoCompra(formasPago);
      const totalDetalles = calcularTotalDetallesCompra(detallesCompra);
      const validacion = validarTotalesCompra(totalFormasPago, totalDetalles, parseResult.data.totalCompra);

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

    // Actualizar la compra
    const [updatedRows] = await Compra.update(parseResult.data, { where: { id }, transaction: t });
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Compra con ID ${id} no encontrada para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    // Si se proporcionaron nuevos detalles, reemplazar los existentes
    if (detallesCompra && Array.isArray(detallesCompra)) {
      // Primero reducir las existencias de los detalles antiguos
      const detallesAntiguos = await DetalleCompra.findAll({ 
        where: { compraId: id }, 
        transaction: t 
      });
      
      await reducirInventarioCompra(
        detallesAntiguos,
        compraActual.bodegaId,
        t,
        BodegaHasProducto.decrement.bind(BodegaHasProducto),
        Producto.decrement.bind(Producto)
      );

      // Eliminar detalles antiguos
      await DetalleCompra.destroy({ where: { compraId: id }, transaction: t });

      // Verificar productos para los nuevos detalles en la nueva bodega
      const nuevaBodegaId = parseResult.data.bodegaId || compraActual.bodegaId;
      for (const detalle of detallesCompra) {
        if (!detalle.cantidadCompra || detalle.cantidadCompra <= 0) {
          throw new Error(`La cantidad de compra debe ser mayor a 0 para el producto ID ${detalle.productoId}`);
        }

        const producto = await Producto.findByPk(detalle.productoId);
        if (!producto) {
          throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
        }

        // Verificar si el producto existe en la nueva bodega, si no, crear la entrada
        const { existe } = await verificarProductoEnBodega(
          detalle.productoId,
          nuevaBodegaId,
          BodegaHasProducto.findOne.bind(BodegaHasProducto),
          t
        );

        if (!existe) {
          await crearEntradaBodegaSiNoExiste(
            detalle.productoId,
            nuevaBodegaId,
            0,
            BodegaHasProducto.create.bind(BodegaHasProducto),
            t
          );
        }
      }

      // Crear nuevos detalles
      const detallesConCompraId = detallesCompra.map((detalle: any) => ({
        ...detalle,
        compraId: id,
      }));
      await DetalleCompra.bulkCreate(detallesConCompraId, { transaction: t });

      // Incrementar existencias con los nuevos detalles
      await incrementarInventario(
        detallesCompra,
        nuevaBodegaId,
        t,
        BodegaHasProducto.increment.bind(BodegaHasProducto),
        Producto.increment.bind(Producto)
      );
    }

    // Si se proporcionaron nuevas formas de pago, reemplazar las existentes
    if (formasPago && Array.isArray(formasPago)) {
      await CompraHasFormaPago.destroy({ where: { compraId: id }, transaction: t });
      const formasPagoConCompraId = formasPago.map((forma: any) => ({
        ...forma,
        compraId: id,
      }));
      await CompraHasFormaPago.bulkCreate(formasPagoConCompraId, { transaction: t });
    }

    await t.commit();

    const updatedCompra = await Compra.findByPk(id, {
      include: [
        { 
          model: Proveedor, 
          as: "proveedor", 
          include: [{ model: Entidad, as: "entidad" }] 
        },
        { model: Estado, as: "estado" },
        { model: Bodega, as: "bodega" },
        { 
          model: DetalleCompra, 
          as: "detallesCompra", 
          include: [{ model: Producto, as: "producto" }] 
        },
        { 
          model: CompraHasFormaPago, 
          as: "formasPago", 
          include: [{ model: FormaPago, as: "formaPago" }] 
        },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Compra actualizada exitosamente`,
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
        message: `Error actualizando compra: ${id} - ${(error as Error).message}`,
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
    const { detallesCompra, formasPago, ...compraData } = req.body;

    // Verificar que la compra existe
    const compraExistente = await Compra.findByPk(id, { transaction: t });
    if (!compraExistente) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Compra con ID ${id} no encontrada`,
          userId,
          genericId: id,
        })
      );
    }

    // Verificar si la compra es modificable
    if (!esCompraModificable(compraExistente.estadoId)) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "No se puede modificar una compra cancelada",
          userId,
          genericId: id,
        })
      );
    }

    // Actualizar la compra si hay datos
    if (Object.keys(compraData).length > 0) {
      // Si se está cambiando la bodega, verificar que existe
      if (compraData.bodegaId && compraData.bodegaId !== compraExistente.bodegaId) {
        const bodega = await Bodega.findByPk(compraData.bodegaId);
        if (!bodega) {
          await t.rollback();
          return res.status(400).json(
            await errorAndLogHandler({
              level: errorLevels.warn,
              message: `Bodega con ID ${compraData.bodegaId} no encontrada`,
              userId,
              genericId: id,
            })
          );
        }
      }

      // Si se está cambiando el proveedor, verificar que existe
      if (compraData.proveedorId && compraData.proveedorId !== compraExistente.proveedorId) {
        const proveedor = await Proveedor.findByPk(compraData.proveedorId);
        if (!proveedor) {
          await t.rollback();
          return res.status(400).json(
            await errorAndLogHandler({
              level: errorLevels.warn,
              message: `Proveedor con ID ${compraData.proveedorId} no encontrado`,
              userId,
              genericId: id,
            })
          );
        }
      }

      const [updatedRows] = await Compra.update(compraData, { where: { id }, transaction: t });
      if (updatedRows === 0) {
        await t.rollback();
        return res.status(404).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: `Compra con ID ${id} no encontrada para actualización parcial`,
            userId,
            genericId: id,
          })
        );
      }
    }

    // Manejar detalles si se proporcionan
    if (detallesCompra && Array.isArray(detallesCompra)) {
      // Obtener la bodega actual (puede haber cambiado en esta misma operación)
      const bodegaActual = compraData.bodegaId || compraExistente.bodegaId;

      // Reducir existencias de detalles antiguos
      const detallesAntiguos = await DetalleCompra.findAll({ 
        where: { compraId: id },
        transaction: t
      });
      
      await reducirInventarioCompra(
        detallesAntiguos,
        compraExistente.bodegaId, // Usar bodega original
        t,
        BodegaHasProducto.decrement.bind(BodegaHasProducto),
        Producto.decrement.bind(Producto)
      );

      // Eliminar detalles antiguos
      await DetalleCompra.destroy({ where: { compraId: id }, transaction: t });

      // Verificar productos para los nuevos detalles
      for (const detalle of detallesCompra) {
        if (!detalle.cantidadCompra || detalle.cantidadCompra <= 0) {
          throw new Error(`La cantidad de compra debe ser mayor a 0 para el producto ID ${detalle.productoId}`);
        }

        const producto = await Producto.findByPk(detalle.productoId);
        if (!producto) {
          throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
        }

        // Verificar si el producto existe en la bodega (actual, que puede haber cambiado)
        const { existe } = await verificarProductoEnBodega(
          detalle.productoId,
          bodegaActual,
          BodegaHasProducto.findOne.bind(BodegaHasProducto),
          t
        );

        if (!existe) {
          await crearEntradaBodegaSiNoExiste(
            detalle.productoId,
            bodegaActual,
            0,
            BodegaHasProducto.create.bind(BodegaHasProducto),
            t
          );
        }
      }

      // Crear nuevos detalles
      const detallesConCompraId = detallesCompra.map((detalle: any) => ({
        ...detalle,
        compraId: id,
      }));
      await DetalleCompra.bulkCreate(detallesConCompraId, { transaction: t });

      // Incrementar existencias con los nuevos detalles en la bodega actual
      await incrementarInventario(
        detallesCompra,
        bodegaActual,
        t,
        BodegaHasProducto.increment.bind(BodegaHasProducto),
        Producto.increment.bind(Producto)
      );
    }

    // Manejar formas de pago si se proporcionan
    if (formasPago && Array.isArray(formasPago)) {
      await CompraHasFormaPago.destroy({ where: { compraId: id }, transaction: t });
      const formasPagoConCompraId = formasPago.map((forma: any) => ({
        ...forma,
        compraId: id,
      }));
      await CompraHasFormaPago.bulkCreate(formasPagoConCompraId, { transaction: t });
    }

    await t.commit();

    const updatedCompra = await Compra.findByPk(id, {
      include: [
        { 
          model: Proveedor, 
          as: "proveedor", 
          include: [{ model: Entidad, as: "entidad" }] 
        },
        { model: Estado, as: "estado" },
        { model: Bodega, as: "bodega" },
        { 
          model: DetalleCompra, 
          as: "detallesCompra", 
          include: [{ model: Producto, as: "producto" }] 
        },
        { 
          model: CompraHasFormaPago, 
          as: "formasPago", 
          include: [{ model: FormaPago, as: "formaPago" }] 
        },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Compra actualizada parcialmente exitosamente`,
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
        message: `Error actualizando compra parcialmente: ${id} - ${(error as Error).message}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const compras = await Compra.findAll({
      include: [
        {
          model: Proveedor,
          as: "proveedor",
          include: [
            {
              model: Entidad,
              as: "entidad",
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
          model: DetalleCompra,
          as: "detallesCompra",
          include: [
            {
              model: Producto,
              as: "producto",
            },
          ],
        },
        {
          model: CompraHasFormaPago,
          as: "formasPago",
          include: [
            {
              model: FormaPago,
              as: "formaPago",
            },
          ],
        },
      ],
      order: [["fechaCompra", "DESC"]],
    });

    return res.status(200).json({ success: compras.length > 0, data: compras });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo compras: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const compra = await Compra.findByPk(id, {
      include: [
        {
          model: Proveedor,
          as: "proveedor",
          include: [
            {
              model: Entidad,
              as: "entidad",
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
          model: DetalleCompra,
          as: "detallesCompra",
          include: [
            {
              model: Producto,
              as: "producto",
            },
          ],
        },
        {
          model: CompraHasFormaPago,
          as: "formasPago",
          include: [
            {
              model: FormaPago,
              as: "formaPago",
            },
          ],
        },
      ],
    });

    res.status(200).json({ success: compra !== null, data: compra });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo la compra: ${id} ${(error as Error).message}`,
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
    // Verificar que la compra existe y obtener sus detalles
    const compra = await Compra.findByPk(id, {
      include: [
        {
          model: DetalleCompra,
          as: "detallesCompra",
        }
      ],
      transaction: t
    });

    if (!compra) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Compra con ID ${id} no encontrada`,
          userId,
          genericId: id,
        })
      );
    }

    // Verificar que la compra no esté ya cancelada
    if (compra.estadoId === ESTADOS_COMPRA.CANCELADA) {
      await t.rollback();
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `La compra ${id} ya está cancelada`,
          userId,
          genericId: id,
        })
      );
    }

    // Reducir existencias usando función helper (cancelar = revertir incremento)
    await reducirInventarioCompra(
      compra.detalleCompra,
      compra.bodegaId,
      t,
      BodegaHasProducto.decrement.bind(BodegaHasProducto),
      Producto.decrement.bind(Producto)
    );

    // Cambiar estado a cancelado
    await Compra.update(
      { estadoId: ESTADOS_COMPRA.CANCELADA },
      { where: { id }, transaction: t }
    );

    await t.commit();

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Compra ${id} cancelada exitosamente`,
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
        message: `Error cancelando compra: ${id} - ${(error as Error).message}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

const getByProveedor = async (req: Request, res: Response) => {
  const { proveedorId } = req.params;
  try {
    const compras = await Compra.findAll({
      where: { proveedorId },
      include: [
        {
          model: Proveedor,
          as: "proveedor",
          include: [{ model: Entidad, as: "entidad" }],
        },
        { model: Estado, as: "estado" },
        { model: Bodega, as: "bodega" },
        {
          model: DetalleCompra,
          as: "detallesCompra",
          include: [{ model: Producto, as: "producto" }],
        },
        {
          model: CompraHasFormaPago,
          as: "formasPago",
          include: [{ model: FormaPago, as: "formaPago" }],
        },
      ],
      order: [["fechaCompra", "DESC"]],
    });

    res.status(200).json({ success: compras.length > 0, data: compras });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo compras del proveedor ${proveedorId}: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
        genericId: proveedorId,
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

    const compras = await Compra.findAll({
      where: {
        fechaCompra: {
          [Op.between]: [new Date(fechaInicio as string), new Date(fechaFin as string)]
        }
      },
      include: [
        {
          model: Proveedor,
          as: "proveedor",
          include: [{ model: Entidad, as: "entidad" }],
        },
        { model: Estado, as: "estado" },
        { model: Bodega, as: "bodega" },
        {
          model: DetalleCompra,
          as: "detallesCompra",
          include: [{ model: Producto, as: "producto" }],
        },
      ],
      order: [["fechaCompra", "DESC"]],
    });

    res.status(200).json({ success: compras.length > 0, data: compras });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo compras por rango de fechas: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getEstadisticas = async (req: Request, res: Response) => {
  try {
    const { query, replacements } = generarQueryEstadisticasCompra(30);
    
    const estadisticas = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    res.status(200).json({ success: true, data: estadisticas });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo estadísticas de compras: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

export const CompraController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
  cancelar,
  getByProveedor,
  getByDateRange,
  getEstadisticas,
};