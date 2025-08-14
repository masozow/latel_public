import { Request, Response } from "express";
import { Cliente, Entidad, TipoCliente } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { ClienteSchema } from "../schemas/cliente.schema.js";
import sequelize from "../config/sequelize.js";

const create = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { entidad, ...clienteData } = req.body;
    const userId = req.user?.id || 0;

    if (!entidad) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "Los datos de la entidad son requeridos",
          userId,
        })
      );
    }

    // Validación Zod de los datos del cliente (sin entidadId)
    const parseResult = ClienteSchema.omit({ id: true, entidadId: true, createdAt: true, updatedAt: true }).safeParse(clienteData);
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

    // 1️⃣ Crear la Entidad
    const nuevaEntidad = await Entidad.create({ ...entidad, estadoId: entidad.estadoId || 1 }, { transaction: t });

    // 2️⃣ Crear el Cliente
    const nuevoCliente = await Cliente.create(
      {
        ...clienteData,
        entidadId: nuevaEntidad.id,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Cliente creado exitosamente",
        shouldSaveLog: true,
        userId,
        genericId: nuevoCliente.id.toString(),
      })
    );
  } catch (error) {
    await t.rollback();
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error creando cliente y entidad: ${
          typeof error === "string" ? error : JSON.stringify(error)
        }`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.findAll({
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
    });

    return res.status(200).json({ success: clientes.length > 0, data: clientes });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo clientes: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findByPk(id, {
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
    });

    res.status(200).json({ success: cliente !== null, data: cliente });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el cliente: ${id} ${(error as Error).message}`,
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
    const { entidad, ...clienteData } = req.body;

    // Validación Zod de los datos del cliente
    const parseResult = ClienteSchema.omit({ id: true, entidadId: true, createdAt: true, updatedAt: true }).safeParse(clienteData);
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

    const [updatedRows] = await Cliente.update(clienteData, { where: { id }, transaction: t });
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Cliente con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    if (entidad) {
      const cliente = await Cliente.findByPk(id);
      await Entidad.update(entidad, { where: { id: cliente?.entidadId }, transaction: t });
    }

    await t.commit();

    const updatedCliente = await Cliente.findByPk(id, {
      include: [
        { model: Entidad, as: "entidad" },
        { model: TipoCliente, as: "tipoCliente" },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Cliente actualizado ${JSON.stringify(updatedCliente?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando cliente: ${id}`,
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
    const { entidad, ...clienteData } = req.body;

    // Actualizar Cliente si hay datos
    if (Object.keys(clienteData).length > 0) {
      const [updatedRows] = await Cliente.update(clienteData, { where: { id }, transaction: t });
      if (updatedRows === 0) {
        await t.rollback();
        return res.status(404).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: `Cliente con ID ${id} no encontrado para actualización parcial`,
            userId,
            genericId: id,
          })
        );
      }
    }

    // Actualizar Entidad si se proporcionó
    if (entidad) {
      const cliente = await Cliente.findByPk(id);
      await Entidad.update(entidad, { where: { id: cliente?.entidadId }, transaction: t });
    }

    await t.commit();

    const updatedCliente = await Cliente.findByPk(id, {
      include: [
        { model: Entidad, as: "entidad" },
        { model: TipoCliente, as: "tipoCliente" },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Cliente actualizado parcialmente: ${JSON.stringify(updatedCliente?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando cliente parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const ClienteController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};