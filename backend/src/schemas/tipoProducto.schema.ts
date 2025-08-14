import { z } from "zod";

export const TipoProductoSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionTipoProducto: z.string().min(1),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TipoProductoAttributes = z.infer<typeof TipoProductoSchema>;
export type TipoProductoCreationAttributes = Omit<TipoProductoAttributes, "id" | "createdAt" | "updatedAt">;
