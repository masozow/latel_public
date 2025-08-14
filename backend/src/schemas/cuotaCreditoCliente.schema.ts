import { z } from "zod";

export const CuotaCreditoClienteSchema = z.object({
  id: z.bigint().positive().optional(),
  fechaProgramadaPagoCuotaCreditoCliente: z.date().optional().nullable(),
  creditoClienteId: z.number().int().positive(),
  montoCuotaCreditoCliente: z.number().positive(),
  pagoCuotaCreditoClienteId: z.bigint().positive().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CuotaCreditoClienteAttributes = z.infer<typeof CuotaCreditoClienteSchema>;
export type CuotaCreditoClienteCreationAttributes = Omit<CuotaCreditoClienteAttributes, "id" | "createdAt" | "updatedAt">;
