import { z } from "zod";

export const PagoCuotaCreditoClienteSchema = z.object({
  id: z.bigint().positive().optional(),
  formaPagoId: z.number().int().positive(),
  montoPagoCuotaCreditoCliente: z.number().positive(),
  comprobantePagoId: z.bigint().positive().optional().nullable(),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type PagoCuotaCreditoClienteAttributes = z.infer<typeof PagoCuotaCreditoClienteSchema>;
export type PagoCuotaCreditoClienteCreationAttributes = Omit<PagoCuotaCreditoClienteAttributes, "id" | "createdAt" | "updatedAt">;
