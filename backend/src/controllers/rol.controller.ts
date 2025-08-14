import { Request, Response } from "express";
import { Rol } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { RolSchema } from "../schemas/rol.schema.js";

const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const rol = await Rol.create({ ...req.body, estadoId: 1 });

    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Rol creado",
        shouldSaveLog: true,
        userId: userId || 0,
        genericId: rol?.id?.toString(),
      })
    );
  } catch (error) {
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error creando el rol: " + (error as Error).message,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const roles = await Rol.findAll();
    return res.status(200).json({ success: roles.length > 0, data: roles });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo los roles: ` + (error as Error).message,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findOne({
      where: { id: id },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ success: rol !== null, data: rol });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el rol: ${id} ` + (error as Error).message,
        userId: req.user?.id || 0,
        error,
        genericId: id,
      })
    );
  }
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const parseResult = RolSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.warn,
        message: `Error: ${parseResult.error.issues
          .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
          .join(", ")}`,
        userId: userId || 0,
        genericId: id,
      })
    );
  }

  try {
    const [updatedRows] = await Rol.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Rol con ID ${id} no encontrado para actualizar`,
          userId: userId || 0,
          genericId: id,
        })
      );
    }

    const updatedRol = await Rol.findByPk(id);

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Rol actualizado ${JSON.stringify(updatedRol?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando rol: ${id}`,
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
    const [updatedRows] = await Rol.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Rol con ID ${id} no encontrado para actualización parcial`,
          userId,
          genericId: id,
        })
      );
    }

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Rol actualizado parcialmente: ${JSON.stringify({ ...req.body }).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando rol parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const RolController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};
