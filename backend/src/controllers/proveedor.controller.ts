import { Request, Response } from "express";
import { Proveedor, Entidad } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { ProveedorSchema } from "../schemas/proveedor.schema.js";
import sequelize from "../config/sequelize.js";

const create = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { entidad, ...proveedorData } = req.body;
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

    // Validación Zod de los datos del proveedor (sin entidadId)
    const parseResult = ProveedorSchema.omit({ id: true, entidadId: true, createdAt: true, updatedAt: true }).safeParse(proveedorData);
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

    // 2️⃣ Crear el Proveedor
    const nuevoProveedor = await Proveedor.create(
      {
        ...proveedorData,
        entidadId: nuevaEntidad.id,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Proveedor creado exitosamente",
        shouldSaveLog: true,
        userId,
        genericId: nuevoProveedor.id.toString(),
      })
    );
  } catch (error) {
    await t.rollback();
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error creando proveedor y entidad: ${
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
    const proveedores = await Proveedor.findAll({
      include: [
        {
          model: Entidad,
          as: "entidad",
        },
      ],
    });

    return res.status(200).json({ success: proveedores.length > 0, data: proveedores });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo proveedores: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const proveedor = await Proveedor.findByPk(id, {
      include: [
        {
          model: Entidad,
          as: "entidad",
        },
      ],
    });

    res.status(200).json({ success: proveedor !== null, data: proveedor });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el proveedor: ${id} ${(error as Error).message}`,
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
    const { entidad, ...proveedorData } = req.body;

    // Validación Zod de los datos del proveedor
    const parseResult = ProveedorSchema.omit({ id: true, entidadId: true, createdAt: true, updatedAt: true }).safeParse(proveedorData);
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

    const [updatedRows] = await Proveedor.update(proveedorData, { where: { id }, transaction: t });
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Proveedor con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    if (entidad) {
      const proveedor = await Proveedor.findByPk(id);
      await Entidad.update(entidad, { where: { id: proveedor?.entidadId }, transaction: t });
    }

    await t.commit();

    const updatedProveedor = await Proveedor.findByPk(id, {
      include: [{ model: Entidad, as: "entidad" }],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Proveedor actualizado ${JSON.stringify(updatedProveedor?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando proveedor: ${id}`,
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
    const { entidad, ...proveedorData } = req.body;

    // Actualizar Proveedor si hay datos
    if (Object.keys(proveedorData).length > 0) {
      const [updatedRows] = await Proveedor.update(proveedorData, { where: { id }, transaction: t });
      if (updatedRows === 0) {
        await t.rollback();
        return res.status(404).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: `Proveedor con ID ${id} no encontrado para actualización parcial`,
            userId,
            genericId: id,
          })
        );
      }
    }

    // Actualizar Entidad si se proporcionó
    if (entidad) {
      const proveedor = await Proveedor.findByPk(id);
      await Entidad.update(entidad, { where: { id: proveedor?.entidadId }, transaction: t });
    }

    await t.commit();

    const updatedProveedor = await Proveedor.findByPk(id, {
      include: [{ model: Entidad, as: "entidad" }],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Proveedor actualizado parcialmente: ${JSON.stringify(updatedProveedor?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando proveedor parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const ProveedorController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};