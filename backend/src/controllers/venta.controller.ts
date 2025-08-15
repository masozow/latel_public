import { Request, Response } from "express";
import { Venta, Cliente, Entidad, TipoCliente, Estado, DetalleVenta, Producto, VentaHasFormaPago, FormaPago, BodegaHasProducto, Bodega } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { VentaSchema } from "../schemas/venta.schema.js";
import sequelize from "../config/sequelize.js";

const create = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { detallesVenta, formasPago, ...ventaData } = req.body;
    const userId = req.user?.id || 0;

    // Validación Zod de los datos de la venta
    const parseResult = VentaSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(ventaData);
    if (!parseResult.success) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Error: ${parseResult.error.issues
            .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
            .join(", ")}`,
          userId,
        })
      );
    }

    // 1️⃣ Crear la Venta
    const nuevaVenta = await Venta.create({ ...parseResult.data, estadoId: ventaData.estadoId || 1 }, { transaction: t });

    // 2️⃣ Crear los Detalles de Venta si se proporcionaron
    if (detallesVenta && Array.isArray(detallesVenta)) {
      // Verificar existencias antes de crear los detalles
      for (const detalle of detallesVenta as DetalleVenta[]) {
        const producto = await Producto.findByPk(detalle.productoId);
        if (!producto) {
          throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
        }

        // Verificar existencia en la bodega específica
        const bodegaProducto = await BodegaHasProducto.findOne({
          where: { 
            productoId: detalle.productoId, 
            bodegaId: ventaData.bodegaId 
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

        // Verificar también existencia total (por seguridad)
        if (producto.totalExistenciaProducto < detalle.cantidadVenta) {
          throw new Error(`Stock insuficiente total para el producto ${producto.descripcionProducto}. Disponible: ${producto.totalExistenciaProducto}, Solicitado: ${detalle.cantidadVenta}`);
        }
      }

      for (const detalle of detallesVenta) {
        detalle.ventaId = nuevaVenta.id;
      }
      await DetalleVenta.bulkCreate(detallesVenta, { transaction: t });

      // Reducir existencias de productos
      for (const detalle of detallesVenta) {
        // Reducir en BodegaHasProducto
        await BodegaHasProducto.decrement('existencia', {
          by: detalle.cantidadVenta,
          where: { 
            productoId: detalle.productoId,
            bodegaId: ventaData.bodegaId 
          },
          transaction: t
        });

        // Reducir existencia total en Producto
        await Producto.decrement('totalExistenciaProducto', {
          by: detalle.cantidadVenta,
          where: { id: detalle.productoId },
          transaction: t
        });
      }
    }

    // 3️⃣ Crear las Formas de Pago si se proporcionaron
    if (formasPago && Array.isArray(formasPago)) {
      const formasPagoConVentaId = formasPago.map((forma: any) => ({
        ...forma,
        ventaId: nuevaVenta.id,
      }));
      await VentaHasFormaPago.bulkCreate(formasPagoConVentaId, { transaction: t });
    }

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
    const ventaActual = await Venta.findByPk(id);
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

    // Validación Zod de los datos de la venta
    const parseResult = VentaSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(ventaData);
    if (!parseResult.success) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Error: ${parseResult.error.issues
            .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
            .join(", ")}`,
          userId,
          genericId: id,
        })
      );
    }

    // Actualizar la venta
    const [updatedRows] = await Venta.update(ventaData, { where: { id }, transaction: t });
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
      const detallesAntiguos = await DetalleVenta.findAll({ where: { ventaId: id } });
      for (const detalle of detallesAntiguos) {
        // Restaurar en BodegaHasProducto (usar bodega original)
        await BodegaHasProducto.increment('existencia', {
          by: detalle.cantidadVenta,
          where: { 
            productoId: detalle.productoId,
            bodegaId: ventaActual.bodegaId 
          },
          transaction: t
        });

        // Restaurar existencia total en Producto
        await Producto.increment('totalExistenciaProducto', {
          by: detalle.cantidadVenta,
          where: { id: detalle.productoId },
          transaction: t
        });
      }

      // Eliminar detalles antiguos
      await DetalleVenta.destroy({ where: { ventaId: id }, transaction: t });

      // Verificar existencias para los nuevos detalles en la nueva bodega
      const nuevaBodegaId = ventaData.bodegaId || ventaActual.bodegaId;
      for (const detalle of detallesVenta) {
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
      for (const detalle of detallesVenta) {
        // Reducir en BodegaHasProducto
        await BodegaHasProducto.decrement('existencia', {
          by: detalle.cantidadVenta,
          where: { 
            productoId: detalle.productoId,
            bodegaId: nuevaBodegaId 
          },
          transaction: t
        });

        // Reducir existencia total en Producto
        await Producto.decrement('totalExistenciaProducto', {
          by: detalle.cantidadVenta,
          where: { id: detalle.productoId },
          transaction: t
        });
      }
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
        { model: Cliente, as: "cliente", include: [{ model: Entidad, as: "entidad" }, { model: TipoCliente, as: "tipoCliente" }] },
        { model: Estado, as: "estado" },
        { model: Bodega, as: "bodega" }, // NUEVA RELACIÓN
        { model: DetalleVenta, as: "detallesVenta", include: [{ model: Producto, as: "producto" }] },
        { model: VentaHasFormaPago, as: "formasPagoVenta", include: [{ model: FormaPago, as: "formaPago" }] },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Venta actualizada: ${JSON.stringify(updatedVenta?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
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

    // Actualizar la venta si hay datos
    if (Object.keys(ventaData).length > 0) {
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
      // Restaurar existencias de detalles antiguos
      const detallesAntiguos = await DetalleVenta.findAll({ where: { ventaId: id } });
      for (const detalle of detallesAntiguos) {
        await Producto.increment('totalExistenciaProducto', {
          by: detalle.cantidadVenta,
          where: { id: detalle.productoId },
          transaction: t
        });
      }

      // Eliminar detalles antiguos
      await DetalleVenta.destroy({ where: { ventaId: id }, transaction: t });

      // Verificar existencias para los nuevos detalles
      for (const detalle of detallesVenta) {
        const producto = await Producto.findByPk(detalle.productoId);
        if (!producto) {
          throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
        }
        if (producto.totalExistenciaProducto < detalle.cantidadVenta) {
          throw new Error(`Stock insuficiente para el producto ${producto.descripcionProducto}. Disponible: ${producto.totalExistenciaProducto}, Solicitado: ${detalle.cantidadVenta}`);
        }
      }

      // Crear nuevos detalles
      const detallesConVentaId = detallesVenta.map((detalle: any) => ({
        ...detalle,
        ventaId: id,
      }));
      await DetalleVenta.bulkCreate(detallesConVentaId, { transaction: t });

      // Reducir existencias con los nuevos detalles
      for (const detalle of detallesVenta) {
        await Producto.decrement('totalExistenciaProducto', {
          by: detalle.cantidadVenta,
          where: { id: detalle.productoId },
          transaction: t
        });
      }
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
        { model: Cliente, as: "cliente", include: [{ model: Entidad, as: "entidad" }, { model: TipoCliente, as: "tipoCliente" }] },
        { model: Estado, as: "estado" },
        { model: DetalleVenta, as: "detallesVenta", include: [{ model: Producto, as: "producto" }] },
        { model: VentaHasFormaPago, as: "formasPagoVenta", include: [{ model: FormaPago, as: "formaPago" }] },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Venta actualizada parcialmente: ${JSON.stringify(updatedVenta?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
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
export const VentaController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};