import { z } from "zod";

export const CreditoProveedorSchema = z.object({
  id: z.number().int().positive().optional(),
  montoCreditoProveedor: z.number().positive(),
  fechaLimiteCreditoProveedor: z.date().optional().nullable(),
  cantidadCuotasCreditoProveedor: z.number().int().positive().optional().nullable(),
  compraId: z.number().int().positive(),
  proveedorId: z.number().int().positive(),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CreditoProveedorAttributes = z.infer<typeof CreditoProveedorSchema>;
export type CreditoProveedorCreationAttributes = Omit<CreditoProveedorAttributes, "id" | "createdAt" | "updatedAt">;
