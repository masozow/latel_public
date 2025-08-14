import { Request, Response } from "express";
import { PrecioProducto } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { PrecioProductoSchema } from "../schemas/precioProducto.schema.js";

const create = async (req: Request, res: Response) => {
  try {
    const parseResult = PrecioProductoSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Error: ${parseResult.error.issues
            .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
            .join(", ")}`,
          userId: req.user?.id || 0,
        })
      );
    }

    const precioProducto = await PrecioProducto.create({ ...parseResult.data, estadoId: req.body.estadoId || 1 });
    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Precio de producto creado",
        shouldSaveLog: true,
        userId: req.user?.id || 0,
        genericId: precioProducto?.id?.toString(),
      })
    );
  } catch (error) {
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error creando precio de producto",
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const preciosProducto = await PrecioProducto.findAll();
    return res.status(200).json({ success: preciosProducto.length > 0, data: preciosProducto });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error obteniendo precios de producto",
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const precioProducto = await PrecioProducto.findOne({
      where: { id },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ success: precioProducto !== null, data: precioProducto });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el precio de producto: ${id}`,
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

  const parseResult = PrecioProductoSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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

  try {
    const [updatedRows] = await PrecioProducto.update(parseResult.data, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Precio de producto con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    const updatedPrecioProducto = await PrecioProducto.findByPk(id);

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Precio de producto actualizado ${JSON.stringify(updatedPrecioProducto?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando precio de producto: ${id}`,
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

  try {
    const [updatedRows] = await PrecioProducto.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Precio de producto con ID ${id} no encontrado para actualización parcial`,
          userId,
          genericId: id,
        })
      );
    }

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Precio de producto actualizado parcialmente: ${JSON.stringify({ ...req.body }).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando precio de producto parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const PrecioProductoController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};