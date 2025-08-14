import { z } from "zod";

export const PrecioProductoSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionPrecioProducto: z.string().min(1),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type PrecioProductoAttributes = z.infer<typeof PrecioProductoSchema>;
export type PrecioProductoCreationAttributes = Omit<PrecioProductoAttributes, "id" | "createdAt" | "updatedAt">;
