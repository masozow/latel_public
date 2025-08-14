import { z } from "zod";

export const BodegaHasProductoSchema = z.object({
  id: z.bigint().positive().optional(),
  bodegaId: z.number().int().positive(),
  productoId: z.number().int().positive(),
  existencia: z.number().int().min(0).optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type BodegaHasProductoAttributes = z.infer<typeof BodegaHasProductoSchema>;
export type BodegaHasProductoCreationAttributes = Omit<BodegaHasProductoAttributes, "id" | "createdAt" | "updatedAt">;
