import { Request, Response } from "express";
import { CreditoCliente, Cliente, Entidad, TipoCliente, Venta, Estado, CuotaCreditoCliente } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { CreditoClienteSchema } from "../schemas/creditoCliente.schema.js";
import sequelize from "../config/sequelize.js";

const create = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { cuotas, ...creditoData } = req.body;
    const userId = req.user?.id || 0;

    // Validación Zod de los datos del crédito
    const parseResult = CreditoClienteSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(creditoData);
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

    // Verificar que el cliente tenga crédito disponible
    const cliente = await Cliente.findByPk(creditoData.clienteId);
    if (!cliente) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Cliente con ID ${creditoData.clienteId} no encontrado`,
          userId,
        })
      );
    }

    if (!cliente.tieneCreditoCliente) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `El cliente no tiene crédito habilitado`,
          userId,
        })
      );
    }

    // Verificar límite de crédito
    const saldoActual = cliente.saldoCreditoCliente || 0;
    const limite = cliente.montoLimiteCreditoCliente || 0;
    if ((saldoActual + creditoData.montoCreditoCliente) > limite) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `El crédito excede el límite disponible. Límite: ${limite}, Saldo actual: ${saldoActual}, Nuevo crédito: ${creditoData.montoCreditoCliente}`,
          userId,
        })
      );
    }

    // 1️⃣ Crear el Crédito Cliente
    const nuevoCredito = await CreditoCliente.create({ ...parseResult.data, estadoId: creditoData.estadoId || 1 }, { transaction: t });

    // 2️⃣ Actualizar el saldo de crédito del cliente
    await Cliente.update(
      {
        saldoCreditoCliente: saldoActual + creditoData.montoCreditoCliente
      },
      { where: { id: creditoData.clienteId }, transaction: t }
    );

    // 3️⃣ Crear las Cuotas si se proporcionaron
    if (cuotas && Array.isArray(cuotas)) {
      const cuotasConCreditoId = cuotas.map((cuota: any) => ({
        ...cuota,
        creditoClienteId: nuevoCredito.id,
      }));
      await CuotaCreditoCliente.bulkCreate(cuotasConCreditoId, { transaction: t });
    }

    await t.commit();

    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Crédito de cliente creado exitosamente",
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
        message: `Error creando crédito de cliente: ${typeof error === "string" ? error : (error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const creditosCliente = await CreditoCliente.findAll({
      include: [
        {
          model: Cliente,
          as: "cliente",
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
        },
        {
          model: Venta,
          as: "venta",
        },
        {
          model: Estado,
          as: "estado",
        },
        {
          model: CuotaCreditoCliente,
          as: "cuotasCreditoCliente",
        },
      ],
      order: [["fechaLimiteCreditoCliente", "ASC"]],
    });

    return res.status(200).json({ success: creditosCliente.length > 0, data: creditosCliente });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo créditos de cliente: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const creditoCliente = await CreditoCliente.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: "cliente",
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
        },
        {
          model: Venta,
          as: "venta",
        },
        {
          model: Estado,
          as: "estado",
        },
        {
          model: CuotaCreditoCliente,
          as: "cuotasCreditoCliente",
        },
      ],
    });

    res.status(200).json({ success: creditoCliente !== null, data: creditoCliente });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el crédito de cliente: ${id} ${(error as Error).message}`,
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
    const parseResult = CreditoClienteSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(creditoData);
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

    // Obtener el crédito actual para ajustar saldos
    const creditoActual = await CreditoCliente.findByPk(id);
    if (!creditoActual) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Crédito de cliente con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    // Si cambia el monto del crédito, actualizar el saldo del cliente
    if (creditoData.montoCreditoCliente && creditoData.montoCreditoCliente !== creditoActual.montoCreditoCliente) {
      const diferencia = creditoData.montoCreditoCliente - creditoActual.montoCreditoCliente;
      const cliente = await Cliente.findByPk(creditoActual.clienteId);
      
      if (cliente) {
        const nuevoSaldo = (cliente.saldoCreditoCliente || 0) + diferencia;
        const limite = cliente.montoLimiteCreditoCliente || 0;
        
        if (nuevoSaldo > limite) {
          await t.rollback();
          return res.status(400).json(
            await errorAndLogHandler({
              level: errorLevels.warn,
              message: `El nuevo monto excede el límite de crédito. Límite: ${limite}, Nuevo saldo: ${nuevoSaldo}`,
              userId,
              genericId: id,
            })
          );
        }

        await Cliente.update(
          { saldoCreditoCliente: nuevoSaldo },
          { where: { id: creditoActual.clienteId }, transaction: t }
        );
      }
    }

    // Actualizar el crédito
    const [updatedRows] = await CreditoCliente.update(creditoData, { where: { id }, transaction: t });
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Crédito de cliente con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    // Si se proporcionaron nuevas cuotas, reemplazar las existentes
    if (cuotas && Array.isArray(cuotas)) {
      await CuotaCreditoCliente.destroy({ where: { creditoClienteId: id }, transaction: t });
      const cuotasConCreditoId = cuotas.map((cuota: any) => ({
        ...cuota,
        creditoClienteId: id,
      }));
      await CuotaCreditoCliente.bulkCreate(cuotasConCreditoId, { transaction: t });
    }

    await t.commit();

    const updatedCredito = await CreditoCliente.findByPk(id, {
      include: [
        { model: Cliente, as: "cliente", include: [{ model: Entidad, as: "entidad" }] },
        { model: Venta, as: "venta" },
        { model: Estado, as: "estado" },
        { model: CuotaCreditoCliente, as: "cuotasCreditoCliente" },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Crédito de cliente actualizado ${JSON.stringify(updatedCredito?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando crédito de cliente: ${id} - ${(error as Error).message}`,
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
      // Si se actualiza el monto, manejar el saldo del cliente
      if (creditoData.montoCreditoCliente) {
        const creditoActual = await CreditoCliente.findByPk(id);
        if (creditoActual) {
          const diferencia = creditoData.montoCreditoCliente - creditoActual.montoCreditoCliente;
          const cliente = await Cliente.findByPk(creditoActual.clienteId);
          
          if (cliente && diferencia !== 0) {
            const nuevoSaldo = (cliente.saldoCreditoCliente || 0) + diferencia;
            const limite = cliente.montoLimiteCreditoCliente || 0;
            
            if (nuevoSaldo > limite) {
              await t.rollback();
              return res.status(400).json(
                await errorAndLogHandler({
                  level: errorLevels.warn,
                  message: `El nuevo monto excede el límite de crédito. Límite: ${limite}, Nuevo saldo: ${nuevoSaldo}`,
                  userId,
                  genericId: id,
                })
              );
            }

            await Cliente.update(
              { saldoCreditoCliente: nuevoSaldo },
              { where: { id: creditoActual.clienteId }, transaction: t }
            );
          }
        }
      }

      const [updatedRows] = await CreditoCliente.update(creditoData, { where: { id }, transaction: t });
      if (updatedRows === 0) {
        await t.rollback();
        return res.status(404).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: `Crédito de cliente con ID ${id} no encontrado para actualización parcial`,
            userId,
            genericId: id,
          })
        );
      }
    }

    // Manejar cuotas si se proporcionan
    if (cuotas && Array.isArray(cuotas)) {
      await CuotaCreditoCliente.destroy({ where: { creditoClienteId: id }, transaction: t });
      const cuotasConCreditoId = cuotas.map((cuota: any) => ({
        ...cuota,
        creditoClienteId: id,
      }));
      await CuotaCreditoCliente.bulkCreate(cuotasConCreditoId, { transaction: t });
    }

    await t.commit();

    const updatedCredito = await CreditoCliente.findByPk(id, {
      include: [
        { model: Cliente, as: "cliente", include: [{ model: Entidad, as: "entidad" }] },
        { model: Venta, as: "venta" },
        { model: Estado, as: "estado" },
        { model: CuotaCreditoCliente, as: "cuotasCreditoCliente" },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Crédito de cliente actualizado parcialmente: ${JSON.stringify(updatedCredito?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    await t.rollback();
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando crédito de cliente parcialmente: ${id} - ${(error as Error).message}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const CreditoClienteController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};