import { Request, Response } from "express";
import { Bodega } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { BodegaSchema } from "../schemas/bodega.schema.js";

const create = async (req: Request, res: Response) => {
  try {
    const bodega = await Bodega.create({ ...req.body, estadoId: 1 });
    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Bodega creada",
        shouldSaveLog: true,
        userId: req.user?.id || 0,
        genericId: bodega?.id?.toString(),
      })
    );
  } catch (error) {
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error creando bodega: " + (error as Error).message,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const bodegas = await Bodega.findAll();
    return res.status(200).json({ success: bodegas.length > 0, data: bodegas });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo bodegas: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const bodega = await Bodega.findOne({
      where: { id },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ success: bodega !== null, data: bodega });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo la bodega: ${id} ${(error as Error).message}`,
        userId: req.user?.id || 0,
        error,
        genericId: id,
      })
    );
  }
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || 0;

  // Validación Zod
  const parseResult = BodegaSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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
    const [updatedRows] = await Bodega.update(parseResult.data, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Bodega con ID ${id} no encontrada para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    const updatedBodega = await Bodega.findByPk(id);

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Bodega actualizada ${JSON.stringify(updatedBodega?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando bodega: ${id}`,
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
    const [updatedRows] = await Bodega.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Bodega con ID ${id} no encontrada para actualización parcial`,
          userId,
          genericId: id,
        })
      );
    }

    const updatedBodega = await Bodega.findByPk(id);

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Bodega actualizada parcialmente: ${JSON.stringify(updatedBodega?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando bodega parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const BodegaController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};
