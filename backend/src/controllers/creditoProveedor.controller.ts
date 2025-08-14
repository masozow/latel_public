import { Request, Response } from "express";
import { CreditoProveedor, Compra, Proveedor, Entidad, Estado, CuotaCreditoProveedor } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { CreditoProveedorSchema } from "../schemas/creditoProveedor.schema.js";
import sequelize from "../config/sequelize.js";

const create = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { cuotas, ...creditoData } = req.body;
    const userId = req.user?.id || 0;

    // Validación Zod de los datos del crédito
    const parseResult = CreditoProveedorSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(creditoData);
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

    // Verificar que la compra y proveedor existan
    const compra = await Compra.findByPk(creditoData.compraId);
    if (!compra) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Compra con ID ${creditoData.compraId} no encontrada`,
          userId,
        })
      );
    }

    const proveedor = await Proveedor.findByPk(creditoData.proveedorId);
    if (!proveedor) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Proveedor con ID ${creditoData.proveedorId} no encontrado`,
          userId,
        })
      );
    }

    // 1️⃣ Crear el Crédito Proveedor
    const nuevoCredito = await CreditoProveedor.create({ ...parseResult.data, estadoId: creditoData.estadoId || 1 }, { transaction: t });

    // 2️⃣ Crear las Cuotas si se proporcionaron
    if (cuotas && Array.isArray(cuotas)) {
      const cuotasConCreditoId = cuotas.map((cuota: any) => ({
        ...cuota,
        creditoProveedorId: nuevoCredito.id,
      }));
      await CuotaCreditoProveedor.bulkCreate(cuotasConCreditoId, { transaction: t });
    }

    await t.commit();

    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Crédito de proveedor creado exitosamente",
        shouldSaveLog: true,
        userId,
        genericId: nuevoCredito.id.toString(),
      })
    );
  } catch (error) {
    await t.rollback();
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error creando crédito de proveedor: ${typeof error === "string" ? error : (error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const creditosProveedor = await CreditoProveedor.findAll({
      include: [
        {
          model: Compra,
          as: "compra",
        },
        {
          model: Proveedor,
          as: "proveedor",
          include: [
            {
              model: Entidad,
              as: "entidad",
            },
          ],
        },
        {
          model: Estado,
          as: "estado",
        },
        {
          model: CuotaCreditoProveedor,
          as: "cuotasCreditoProveedor",
        },
      ],
      order: [["fechaLimiteCreditoProveedor", "ASC"]],
    });

    return res.status(200).json({ success: creditosProveedor.length > 0, data: creditosProveedor });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo créditos de proveedor: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const creditoProveedor = await CreditoProveedor.findByPk(id, {
      include: [
        {
          model: Compra,
          as: "compra",
        },
        {
          model: Proveedor,
          as: "proveedor",
          include: [
            {
              model: Entidad,
              as: "entidad",
            },
          ],
        },
        {
          model: Estado,
          as: "estado",
        },
        {
          model: CuotaCreditoProveedor,
          as: "cuotasCreditoProveedor",
        },
      ],
    });

    res.status(200).json({ success: creditoProveedor !== null, data: creditoProveedor });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el crédito de proveedor: ${id} ${(error as Error).message}`,
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
    const { cuotas, ...creditoData } = req.body;

    // Validación Zod de los datos del crédito
    const parseResult = CreditoProveedorSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(creditoData);
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

    // Actualizar el crédito
    const [updatedRows] = await CreditoProveedor.update(creditoData, { where: { id }, transaction: t });
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Crédito de proveedor con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    // Si se proporcionaron nuevas cuotas, reemplazar las existentes
    if (cuotas && Array.isArray(cuotas)) {
      await CuotaCreditoProveedor.destroy({ where: { creditoProveedorId: id }, transaction: t });
      const cuotasConCreditoId = cuotas.map((cuota: any) => ({
        ...cuota,
        creditoProveedorId: id,
      }));
      await CuotaCreditoProveedor.bulkCreate(cuotasConCreditoId, { transaction: t });
    }

    await t.commit();

    const updatedCredito = await CreditoProveedor.findByPk(id, {
      include: [
        { model: Compra, as: "compra" },
        { model: Proveedor, as: "proveedor", include: [{ model: Entidad, as: "entidad" }] },
        { model: Estado, as: "estado" },
        { model: CuotaCreditoProveedor, as: "cuotasCreditoProveedor" },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Crédito de proveedor actualizado ${JSON.stringify(updatedCredito?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando crédito de proveedor: ${id} - ${(error as Error).message}`,
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
    const { cuotas, ...creditoData } = req.body;

    // Actualizar el crédito si hay datos
    if (Object.keys(creditoData).length > 0) {
      const [updatedRows] = await CreditoProveedor.update(creditoData, { where: { id }, transaction: t });
      if (updatedRows === 0) {
        await t.rollback();
        return res.status(404).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: `Crédito de proveedor con ID ${id} no encontrado para actualización parcial`,
            userId,
            genericId: id,
          })
        );
      }
    }

    // Manejar cuotas si se proporcionan
    if (cuotas && Array.isArray(cuotas)) {
      await CuotaCreditoProveedor.destroy({ where: { creditoProveedorId: id }, transaction: t });
      const cuotasConCreditoId = cuotas.map((cuota: any) => ({
        ...cuota,
        creditoProveedorId: id,
      }));
      await CuotaCreditoProveedor.bulkCreate(cuotasConCreditoId, { transaction: t });
    }

    await t.commit();

    const updatedCredito = await CreditoProveedor.findByPk(id, {
      include: [
        { model: Compra, as: "compra" },
        { model: Proveedor, as: "proveedor", include: [{ model: Entidad, as: "entidad" }] },
        { model: Estado, as: "estado" },
        { model: CuotaCreditoProveedor, as: "cuotasCreditoProveedor" },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Crédito de proveedor actualizado parcialmente: ${JSON.stringify(updatedCredito?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando crédito de proveedor parcialmente: ${id} - ${(error as Error).message}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const CreditoProveedorController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};