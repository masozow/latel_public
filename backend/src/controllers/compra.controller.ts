import { Request, Response } from "express";
import { Compra, Proveedor, Entidad, Estado, DetalleCompra, Producto, CompraHasFormaPago, FormaPago } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { CompraSchema } from "../schemas/compra.schema.js";
import sequelize from "../config/sequelize.js";

const create = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { detallesCompra, formasPago, ...compraData } = req.body;
    const userId = req.user?.id || 0;

    // Validación Zod de los datos de la compra
    const parseResult = CompraSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(compraData);
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

    // 1️⃣ Crear la Compra
    const nuevaCompra = await Compra.create({ ...parseResult.data, estadoId: compraData.estadoId || 1 }, { transaction: t });

    // 2️⃣ Crear los Detalles de Compra si se proporcionaron
    if (detallesCompra && Array.isArray(detallesCompra)) {
      const detallesConCompraId = detallesCompra.map((detalle: any) => ({
        ...detalle,
        compraId: nuevaCompra.id,
      }));
      await DetalleCompra.bulkCreate(detallesConCompraId, { transaction: t });

      // Actualizar existencias de productos
      for (const detalle of detallesCompra) {
        await Producto.increment('totalExistenciaProducto', {
          by: detalle.cantidadCompra,
          where: { id: detalle.productoId },
          transaction: t
        });
      }
    }

    // 3️⃣ Crear las Formas de Pago si se proporcionaron
    if (formasPago && Array.isArray(formasPago)) {
      const formasPagoConCompraId = formasPago.map((forma: any) => ({
        ...forma,
        compraId: nuevaCompra.id,
      }));
      await CompraHasFormaPago.bulkCreate(formasPagoConCompraId, { transaction: t });
    }

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
        message: `Error creando compra: ${typeof error === "string" ? error : JSON.stringify(error)}`,
        error,
        userId: req.user?.id || 0,
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

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || 0;
  const t = await sequelize.transaction();

  try {
    const { detallesCompra, formasPago, ...compraData } = req.body;

    // Validación Zod de los datos de la compra
    const parseResult = CompraSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(compraData);
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

    // Actualizar la compra
    const [updatedRows] = await Compra.update(compraData, { where: { id }, transaction: t });
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
      // Primero revertir las existencias de los detalles antiguos
      const detallesAntiguos = await DetalleCompra.findAll({ where: { compraId: id } });
      for (const detalle of detallesAntiguos) {
        await Producto.decrement('totalExistenciaProducto', {
          by: detalle.cantidadCompra,
          where: { id: detalle.productoId },
          transaction: t
        });
      }

      // Eliminar detalles antiguos
      await DetalleCompra.destroy({ where: { compraId: id }, transaction: t });

      // Crear nuevos detalles
      const detallesConCompraId = detallesCompra.map((detalle: any) => ({
        ...detalle,
        compraId: id,
      }));
      await DetalleCompra.bulkCreate(detallesConCompraId, { transaction: t });

      // Actualizar existencias con los nuevos detalles
      for (const detalle of detallesCompra) {
        await Producto.increment('totalExistenciaProducto', {
          by: detalle.cantidadCompra,
          where: { id: detalle.productoId },
          transaction: t
        });
      }
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
        { model: Proveedor, as: "proveedor", include: [{ model: Entidad, as: "entidad" }] },
        { model: Estado, as: "estado" },
        { model: DetalleCompra, as: "detallesCompra" },
        { model: CompraHasFormaPago, as: "formasPago" },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Compra actualizada ${JSON.stringify(updatedCompra?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando compra: ${id}`,
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

    // Actualizar la compra si hay datos
    if (Object.keys(compraData).length > 0) {
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

    // Manejar detalles y formas de pago como en update si se proporcionan
    if (detallesCompra && Array.isArray(detallesCompra)) {
      const detallesAntiguos = await DetalleCompra.findAll({ where: { compraId: id } });
      for (const detalle of detallesAntiguos) {
        await Producto.decrement('totalExistenciaProducto', {
          by: detalle.cantidadCompra,
          where: { id: detalle.productoId },
          transaction: t
        });
      }

      await DetalleCompra.destroy({ where: { compraId: id }, transaction: t });
      const detallesConCompraId = detallesCompra.map((detalle: any) => ({
        ...detalle,
        compraId: id,
      }));
      await DetalleCompra.bulkCreate(detallesConCompraId, { transaction: t });

      for (const detalle of detallesCompra) {
        await Producto.increment('totalExistenciaProducto', {
          by: detalle.cantidadCompra,
          where: { id: detalle.productoId },
          transaction: t
        });
      }
    }

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
        { model: Proveedor, as: "proveedor", include: [{ model: Entidad, as: "entidad" }] },
        { model: Estado, as: "estado" },
        { model: DetalleCompra, as: "detallesCompra" },
        { model: CompraHasFormaPago, as: "formasPago" },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Compra actualizada parcialmente: ${JSON.stringify(updatedCompra?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando compra parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
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
};