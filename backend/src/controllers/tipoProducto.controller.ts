import { Request, Response } from "express";
import { TipoProducto } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { TipoProductoSchema } from "../schemas/tipoProducto.schema.js";

const create = async (req: Request, res: Response) => {
  try {
    const parseResult = TipoProductoSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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

    const tipoProducto = await TipoProducto.create({ ...parseResult.data, estadoId: req.body.estadoId || 1 });
    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Tipo de producto creado",
        shouldSaveLog: true,
        userId: req.user?.id || 0,
        genericId: tipoProducto?.id?.toString(),
      })
    );
  } catch (error) {
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error creando tipo de producto",
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const tiposProducto = await TipoProducto.findAll();
    return res.status(200).json({ success: tiposProducto.length > 0, data: tiposProducto });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error obteniendo tipos de producto",
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tipoProducto = await TipoProducto.findOne({
      where: { id },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ success: tipoProducto !== null, data: tipoProducto });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el tipo de producto: ${id}`,
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

  const parseResult = TipoProductoSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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
    const [updatedRows] = await TipoProducto.update(parseResult.data, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Tipo de producto con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    const updatedTipoProducto = await TipoProducto.findByPk(id);

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Tipo de producto actualizado ${JSON.stringify(updatedTipoProducto?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando tipo de producto: ${id}`,
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
    const [updatedRows] = await TipoProducto.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Tipo de producto con ID ${id} no encontrado para actualización parcial`,
          userId,
          genericId: id,
        })
      );
    }

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Tipo de producto actualizado parcialmente: ${JSON.stringify({ ...req.body }).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando tipo de producto parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const TipoProductoController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};
