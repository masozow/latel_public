import { Request, Response } from "express";
import { LineaProducto } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { LineaProductoSchema } from "../schemas/lineaProducto.schema.js";

const create = async (req: Request, res: Response) => {
  try {
    const parseResult = LineaProductoSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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

    const lineaProducto = await LineaProducto.create({ ...parseResult.data, estadoId: req.body.estadoId || 1 });
    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Línea de producto creada",
        shouldSaveLog: true,
        userId: req.user?.id || 0,
        genericId: lineaProducto?.id?.toString(),
      })
    );
  } catch (error) {
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error creando línea de producto",
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const lineasProducto = await LineaProducto.findAll();
    return res.status(200).json({ success: lineasProducto.length > 0, data: lineasProducto });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error obteniendo líneas de producto",
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const lineaProducto = await LineaProducto.findOne({
      where: { id },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ success: lineaProducto !== null, data: lineaProducto });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo la línea de producto: ${id}`,
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

  const parseResult = LineaProductoSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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
    const [updatedRows] = await LineaProducto.update(parseResult.data, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Línea de producto con ID ${id} no encontrada para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    const updatedLineaProducto = await LineaProducto.findByPk(id);

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Línea de producto actualizada ${JSON.stringify(updatedLineaProducto?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando línea de producto: ${id}`,
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
    const [updatedRows] = await LineaProducto.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Línea de producto con ID ${id} no encontrada para actualización parcial`,
          userId,
          genericId: id,
        })
      );
    }

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Línea de producto actualizada parcialmente: ${JSON.stringify({ ...req.body }).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando línea de producto parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const LineaProductoController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};