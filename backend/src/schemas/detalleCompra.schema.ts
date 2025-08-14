import { z } from "zod";

export const DetalleCompraSchema = z.object({
  id: z.bigint().positive().optional(),
  compraId: z.number().int().positive(),
  productoId: z.number().int().positive(),
  cantidadCompra: z.number().int().positive(),
  precioCompra: z.number().positive(),
  subTotalCompra: z.number().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type DetalleCompraAttributes = z.infer<typeof DetalleCompraSchema>;
export type DetalleCompraCreationAttributes = Omit<DetalleCompraAttributes, "id" | "createdAt" | "updatedAt">;