  import { Request, Response } from "express";
  import {Estado} from "../models/index.js";
  import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { EstadoSchema } from "../schemas/estado.schema.js";

  const create = async (req: Request, res: Response) => {
  try {
    const estado = await Estado.create({ ...req.body,activoEstado: true });
    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Estado creado",
        shouldSaveLog: true,
        userId: req.user?.id || 0,
        genericId: estado?.id?.toString(),
      })
    );
  } catch (error) {
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error creando estado: " + (error as Error).message,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

  const getAll = async (req: Request, res: Response) => {
    try {
      const estados = await Estado.findAll();
      return res.status(200).json({ success: estados.length > 0, data: estados });
    } catch (error) {
      res.status(500).json(
        await errorAndLogHandler({
          level: errorLevels.error,
          message: `Error obteniendo los estados: ` + error.message,
          error,
          userId: req.user?.id || 0,
        })
      );
    }
  };

  const getByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const estado = await Estado.findOne({ where: { id:id },  order: [['updatedAt', 'DESC']],
    });
      res.status(200).json({ success: estado !== null, data: estado });
    } catch (error) {
      res.status(500).json(
        await errorAndLogHandler({
          level: errorLevels.error,
          message: `Error obteniendo el estado: ${id} ` + error.message,
          userId: req.user.id || 0,
          error,
          genericId: id,
        })
      );
    }
  };
const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const parseResult = EstadoSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Error: ${ (parseResult.error.issues.map((issue) => issue.path + " - " + issue.message).join(", "))}`,
          userId: userId || 0,
          genericId: id,
        })
      );
  }
  try {
    const [updatedRows] = await Estado.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Estado con ID ${id} no encontrado para actualizar`,
          userId: userId || 0,
          genericId: id,
        })
      );
    }

    const updatedEstado = await Estado.findByPk(id);

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Estado actualizado ${JSON.stringify(updatedEstado.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando estado: ${id}`,
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
    const [updatedRows] = await Estado.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Estado con ID ${id} no encontrado para actualización parcial`,
          userId,
          genericId: id,
        })
      );
    }

    const updatedEstado = await Estado.findByPk(id);

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Estado actualizado parcialmente: ${JSON.stringify({...req.body}).replace(/"/g, "'") }`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando estado parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const EstadoController = {
  create,
  getAll,
  getByID,
  update,         
  partialUpdate,  
};