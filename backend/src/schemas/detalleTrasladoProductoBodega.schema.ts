import { z } from "zod";

export const DetalleTrasladoProductoBodegaSchema = z.object({
  id: z.bigint().positive().optional(),
  trasladoProductoId: z.number().int().positive(),
  bodegaOrigen: z.number().int().positive(),
  bodegaDestino: z.number().int().positive(),
  productoId: z.number().int().positive(),
  cantidadProductoTrasladado: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type DetalleTrasladoProductoBodegaAttributes = z.infer<typeof DetalleTrasladoProductoBodegaSchema>;
export type DetalleTrasladoProductoBodegaCreationAttributes = Omit<DetalleTrasladoProductoBodegaAttributes, "id" | "createdAt" | "updatedAt">;
