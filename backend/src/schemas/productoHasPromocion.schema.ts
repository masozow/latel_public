import { z } from "zod";

export const ProductoHasPromocionSchema = z.object({
  productoId: z.number().int().positive(),
  promocionId: z.number().int().positive(),
});

export type ProductoHasPromocionAttributes = z.infer<typeof ProductoHasPromocionSchema>;