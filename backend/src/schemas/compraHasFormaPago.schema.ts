import { z } from "zod";

export const CompraHasFormaPagoSchema = z.object({
  id: z.bigint().positive().optional(),
  compraId: z.number().int().positive(),
  formaPagoId: z.number().int().positive(),
  montoPagoCompra: z.number().positive(),
  comprobantePagoId: z.bigint().positive().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CompraHasFormaPagoAttributes = z.infer<typeof CompraHasFormaPagoSchema>;
export type CompraHasFormaPagoCreationAttributes = Omit<CompraHasFormaPagoAttributes, "id" | "createdAt" | "updatedAt">;
