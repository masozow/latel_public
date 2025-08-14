import { z } from "zod";

export const ProductoHasPrecioProductoSchema = z.object({
  id: z.bigint().positive().optional(),
  productoId: z.number().int().positive(),
  precioProductoId: z.number().int().positive(),
  montoPrecioProducto: z.number().positive(),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ProductoHasPrecioProductoAttributes = z.infer<typeof ProductoHasPrecioProductoSchema>;
export type ProductoHasPrecioProductoCreationAttributes = Omit<ProductoHasPrecioProductoAttributes, "id" | "createdAt" | "updatedAt">;
