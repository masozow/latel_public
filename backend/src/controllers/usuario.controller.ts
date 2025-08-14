import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Usuario, Entidad } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import sequelize from "../config/sequelize.js";
import { UsuarioSchema } from "../schemas/usuario.schema.js";

const create = async (req: Request, res: Response) => {
  const t = await sequelize.transaction(); // inicia la transacción

  try {
    const { password, entidad, ...usuarioData } = req.body;
    const userId = req.user?.id || 0;

    if (!password) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "La contraseña es requerida",
          userId,
        })
      );
    }

    if (!entidad) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "Los datos de la entidad son requeridos",
          userId,
        })
      );
    }

    // Validación Zod de los datos del usuario (sin password ni entidad)
    const parseResult = UsuarioSchema.omit({ password: true, entidadId: true }).safeParse(usuarioData);
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
    const nuevaEntidad = await Entidad.create(entidad, { transaction: t });

    // 2️⃣ Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Crear el Usuario
    const nuevoUsuario = await Usuario.create(
      {
        ...usuarioData,
        password: hashedPassword,
        entidadId: nuevaEntidad.id,
      },
      { transaction: t }
    );

    // 4️⃣ Commit
    await t.commit();

    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Usuario creado exitosamente",
        shouldSaveLog: true,
        userId: nuevoUsuario.id || 0,
        genericId: nuevoUsuario.id.toString(),
      })
    );
  } catch (error) {
    await t.rollback();
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error creando usuario y entidad: ${
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
    const users = await Usuario.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Entidad,
          as: "entidad",
          attributes: { exclude: ["id"] },
        },
      ],
    });

    return res.status(200).json({ success: users.length > 0, data: users });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo usuarios: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("user id: ", id);
  try {
    const user = await Usuario.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Entidad,
          as: "entidad",
          attributes: { exclude: ["id"] },
        },
      ],
    });

    res.status(200).json({ success: user !== null, data: user });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el usuario: ${id} ${(error as Error).message}`,
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
    const { entidad, ...usuarioData } = req.body;
    const {password}={...usuarioData};
    const hashedPassword = await bcrypt.hash(password, 10);
    usuarioData.password=hashedPassword;
    
    // Validación Zod de los datos del usuario
    const parseResult = UsuarioSchema.omit({ entidadId: true }).safeParse(usuarioData);
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

    const [updatedRows] = await Usuario.update(usuarioData, { where: { id }, transaction: t });
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Usuario con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    if (entidad) {
      const usuario = await Usuario.findByPk(id);
      await Entidad.update(entidad, { where: { id: usuario?.entidadId }, transaction: t });
    }

    await t.commit();

    const updatedUsuario = await Usuario.findByPk(id, {
      include: [{ model: Entidad, as: "entidad", attributes: { exclude: ["id"] } }],
      attributes: { exclude: ["password"] },
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Usuario actualizado ${JSON.stringify(updatedUsuario?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando usuario: ${id}`,
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
    const { entidad, ...usuarioData } = req.body;
    // Actualizar Usuario
    if(Object.keys(usuarioData).length > 0) {
      const {password}={...usuarioData};
      if(password){
        const hashedPassword = await bcrypt.hash(password, 10);
        usuarioData.password=hashedPassword;
      }
      const [updatedRows] = await Usuario.update(usuarioData, { where: { id }, transaction: t });
      if (updatedRows === 0) {
        await t.rollback();
        return res.status(404).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: `Usuario con ID ${id} no encontrado para actualización parcial`,
            userId,
            shouldSaveLog: true,
            genericId: id,
          })
        );
      }  
    }
    

    // Actualizar Entidad si se proporcionó
    if (entidad) {
      const usuario = await Usuario.findByPk(id);
      await Entidad.update(entidad, { where: { id: usuario?.entidadId }, transaction: t });
    }

    await t.commit();

    const updatedUsuario = await Usuario.findByPk(id, {
      include: [{ model: Entidad, as: "entidad", attributes: { exclude: ["id"] } }],
      attributes: { exclude: ["password"] },
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Usuario actualizado parcialmente: ${JSON.stringify(updatedUsuario?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando usuario parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const UserController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};
