import {z} from "zod";

export const CreditoClienteSchema = z.object({
  id: z.number().int().positive().optional(),
  clienteId: z.number().int().positive(),
  ventaId: z.number().int().positive(),
  fechaLimiteCreditoCliente: z.date(),
  cantidadCuotasCreditoCliente: z.number().int().positive().optional().nullable(),
  montoCreditoCliente: z.number().positive(),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CreditoClienteAttributes = z.infer<typeof CreditoClienteSchema>;
export type CreditoClienteCreationAttributes = Omit<CreditoClienteAttributes, "id" | "createdAt" | "updatedAt">;
