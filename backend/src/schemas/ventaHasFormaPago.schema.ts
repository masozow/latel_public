import { z } from "zod";

export const VentaHasFormaPagoSchema = z.object({
  id: z.bigint().positive().optional(),
  ventaId: z.number().int().positive(),
  formaPagoId: z.number().int().positive(),
  montoFormaPagoVenta: z.number().positive(),
  comprobantePagoId: z.bigint().positive().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type VentaHasFormaPagoAttributes = z.infer<typeof VentaHasFormaPagoSchema>;
export type VentaHasFormaPagoCreationAttributes = Omit<VentaHasFormaPagoAttributes, "id" | "createdAt" | "updatedAt">;
