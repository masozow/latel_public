import { z } from "zod";

export const CuotaCreditoProveedorSchema = z.object({
  id: z.bigint().positive().optional(),
  fechaProgramadaPagoCuotaCreditoProveedor: z.date().optional().nullable(),
  montoCuotaCreditoProveedor: z.number().positive(),
  creditoProveedorId: z.number().int().positive(),
  pagoCuotaCreditoProveedorId: z.bigint().positive().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CuotaCreditoProveedorAttributes = z.infer<typeof CuotaCreditoProveedorSchema>;
export type CuotaCreditoProveedorCreationAttributes = Omit<CuotaCreditoProveedorAttributes, "id" | "createdAt" | "updatedAt">;
