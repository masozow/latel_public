import { z } from "zod";

export const ClienteSchema = z.object({
  id: z.number().int().positive().optional(),
  nitCliente: z.string().optional().nullable(),
  tipoClienteId: z.number().int().positive(),
  tieneCreditoCliente: z.boolean(),
  entidadId: z.number().int().positive(),
  saldoCreditoCliente: z.number().optional().nullable(),
  montoLimiteCreditoCliente: z.number().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ClienteAttributes = z.infer<typeof ClienteSchema>;
export type ClienteCreationAttributes = Omit<ClienteAttributes, "id" | "createdAt" | "updatedAt">;
