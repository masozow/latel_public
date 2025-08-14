import { z } from "zod";

export const DetalleVentaSchema = z.object({
  id: z.bigint().positive().optional(),
  ventaId: z.number().int().positive(),
  productoId: z.number().int().positive(),
  cantidadVenta: z.number().int().positive(),
  precioVenta: z.number().positive(),
  subTotalVenta: z.number().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type DetalleVentaAttributes = z.infer<typeof DetalleVentaSchema>;
export type DetalleVentaCreationAttributes = Omit<DetalleVentaAttributes, "id" | "createdAt" | "updatedAt">;
