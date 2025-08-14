import { z } from "zod";

export const LineaProductoSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionLineaProducto: z.string().min(1),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type LineaProductoAttributes = z.infer<typeof LineaProductoSchema>;
export type LineaProductoCreationAttributes = Omit<LineaProductoAttributes, "id" | "createdAt" | "updatedAt">;
