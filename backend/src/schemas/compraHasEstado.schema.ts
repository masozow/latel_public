import { z } from "zod";

export const CompraHasEstadoSchema = z.object({
  compraId: z.number().int().positive(),
  estadoId: z.number().int().positive(),
  usuarioId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CompraHasEstadoAttributes = z.infer<typeof CompraHasEstadoSchema>;
