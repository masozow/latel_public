import { z } from "zod";

export const TipoClienteSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionTipoCliente: z.string().min(1),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TipoClienteAttributes = z.infer<typeof TipoClienteSchema>;
export type TipoClienteCreationAttributes = Omit<TipoClienteAttributes, "id" | "createdAt" | "updatedAt">;
