import { z } from "zod";

export const PromocionSchema = z.object({
  id: z.number().int().positive().optional(),
  estadoId: z.number().int().positive(),
  fechaInicioPromocion: z.date().optional().nullable(),
  fechaFinPromocion: z.date().optional().nullable(),
  porcentajeDescuentoPromocion: z.number().min(0).max(100).optional().nullable(),
  montoDescuentoPromocion: z.number().positive().optional().nullable(),
  descripcionPromocion: z.string().min(1).max(150),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type PromocionAttributes = z.infer<typeof PromocionSchema>;
export type PromocionCreationAttributes = Omit<PromocionAttributes, "id" | "createdAt" | "updatedAt">;
