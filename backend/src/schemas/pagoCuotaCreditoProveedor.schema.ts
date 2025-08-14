import { z } from "zod";

export const PagoCuotaCreditoProveedorSchema = z.object({
  id: z.bigint().positive().optional(),
  formaPagoId: z.number().int().positive(),
  montoPagoCreditoProveedor: z.number().positive(),
  comprobantePagoId: z.bigint().positive().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type PagoCuotaCreditoProveedorAttributes = z.infer<typeof PagoCuotaCreditoProveedorSchema>;
export type PagoCuotaCreditoProveedorCreationAttributes = Omit<PagoCuotaCreditoProveedorAttributes, "id" | "createdAt" | "updatedAt">;