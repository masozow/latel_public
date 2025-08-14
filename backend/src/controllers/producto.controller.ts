import { Request, Response } from "express";
import { Producto, Estado, Marca, TipoProducto, LineaProducto, PrecioProducto } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";
import { ProductoSchema } from "../schemas/producto.schema.js";

const create = async (req: Request, res: Response) => {
  try {
    const parseResult = ProductoSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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

    const producto = await Producto.create({ ...parseResult.data, estadoId: req.body.estadoId || 1 });
    res.status(201).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Producto creado",
        shouldSaveLog: true,
        userId: req.user?.id || 0,
        genericId: producto?.id?.toString(),
      })
    );
  } catch (error) {
    return res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Error creando producto",
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Estado,
          as: "estado",
        },
        {
          model: Marca,
          as: "marca",
        },
        {
          model: TipoProducto,
          as: "tipoProducto",
        },
        {
          model: LineaProducto,
          as: "lineaProducto",
          required: false, // LEFT JOIN para campos opcionales
        },
        {
          model: PrecioProducto,
          as: "precioPorDefecto",
          required: false, // LEFT JOIN para campos opcionales
        },
      ],
    });

    return res.status(200).json({ success: productos.length > 0, data: productos });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo productos: ${(error as Error).message}`,
        error,
        userId: req.user?.id || 0,
      })
    );
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id, {
      include: [
        {
          model: Estado,
          as: "estado",
        },
        {
          model: Marca,
          as: "marca",
        },
        {
          model: TipoProducto,
          as: "tipoProducto",
        },
        {
          model: LineaProducto,
          as: "lineaProducto",
          required: false,
        },
        {
          model: PrecioProducto,
          as: "precioPorDefecto",
          required: false,
        },
      ],
    });

    res.status(200).json({ success: producto !== null, data: producto });
  } catch (error) {
    res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error obteniendo el producto: ${id} ${(error as Error).message}`,
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

  const parseResult = ProductoSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
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
    const [updatedRows] = await Producto.update(parseResult.data, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Producto con ID ${id} no encontrado para actualizar`,
          userId,
          genericId: id,
        })
      );
    }

    const updatedProducto = await Producto.findByPk(id, {
      include: [
        { model: Estado, as: "estado" },
        { model: Marca, as: "marca" },
        { model: TipoProducto, as: "tipoProducto" },
        { model: LineaProducto, as: "lineaProducto", required: false },
        { model: PrecioProducto, as: "precioPorDefecto", required: false },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Producto actualizado ${JSON.stringify(updatedProducto?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando producto: ${id}`,
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
    const [updatedRows] = await Producto.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: `Producto con ID ${id} no encontrado para actualización parcial`,
          userId,
          genericId: id,
        })
      );
    }

    const updatedProducto = await Producto.findByPk(id, {
      include: [
        { model: Estado, as: "estado" },
        { model: Marca, as: "marca" },
        { model: TipoProducto, as: "tipoProducto" },
        { model: LineaProducto, as: "lineaProducto", required: false },
        { model: PrecioProducto, as: "precioPorDefecto", required: false },
      ],
    });

    res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Producto actualizado parcialmente: ${JSON.stringify(updatedProducto?.dataValues).replace(/"/g, "'")}`,
        userId,
        genericId: id,
      })
    );
  } catch (error) {
    res.status(400).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: `Error actualizando producto parcialmente: ${id}`,
        error,
        userId,
        genericId: id,
      })
    );
  }
};

export const ProductoController = {
  create,
  getAll,
  getByID,
  update,
  partialUpdate,
};