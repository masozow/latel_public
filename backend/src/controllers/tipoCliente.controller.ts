import { Request, Response } from "express";
import { TipoCliente } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { TipoClienteSchema } from "../schemas/tipoCliente.schema.js";

const create = async (req: Request, res: Response) => {
  try {
    const parseResult = TipoClienteSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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

    const tipoCliente = await TipoCliente.create({ ...parseResult.data, estadoId: req.body.estadoId || 1 });
    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Tipo de cliente creado",
        shouldSaveLog: true,
        userId: req.user?.id || 0,
        genericId: tipoCliente?.id?.toString(),
      })
    );
  } catch (error) {
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error creando tipo de cliente",
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const tiposCliente = await TipoCliente.findAll();
    return res.status(200).json({ success: tiposCliente.length > 0, data: tiposCliente });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error obteniendo tipos de cliente",
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tipoCliente = await TipoCliente.findOne({
      where: { id },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ success: tipoCliente !== null, data: tipoCliente });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el tipo de cliente: ${id}`,
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

  const parseResult = TipoClienteSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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
    const [updatedRows] = await TipoCliente.update(parseResult.data, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Tipo de cliente con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    const updatedTipoCliente = await TipoCliente.findByPk(id);

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Tipo de cliente actualizado ${JSON.stringify(updatedTipoCliente?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando tipo de cliente: ${id}`,
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
    const [updatedRows] = await TipoCliente.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Tipo de cliente con ID ${id} no encontrado para actualización parcial`,
          userId,
          genericId: id,
        })
      );
    }

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Tipo de cliente actualizado parcialmente: ${JSON.stringify({ ...req.body }).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando tipo de cliente parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const TipoClienteController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};