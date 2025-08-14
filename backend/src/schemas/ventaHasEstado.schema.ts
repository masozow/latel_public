import { z } from "zod";

export const VentaHasEstadoSchema = z.object({
  ventaId: z.number().int().positive(),
  estadoId: z.number().int().positive(),
  usuarioId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type VentaHasEstadoAttributes = z.infer<typeof VentaHasEstadoSchema>;
export type VentaHasEstadoCreationAttributes = Omit<VentaHasEstadoAttributes, "createdAt" | "updatedAt">;
