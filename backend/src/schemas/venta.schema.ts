import { z } from "zod";
import { DetalleVentaSchema } from "./detalleVenta.schema.js";

export const VentaSchema = z.object({
  id: z.number().int().positive().optional(),
  clienteId: z.number().int().positive(),
  bodegaId: z.number().int().positive(),
  fechaVenta: z.date(),
  totalVenta: z.number().positive(),
  numeroDocumentoVenta: z.string().optional().nullable(),
  serieDocumentoVenta: z.string().optional().nullable(),
  detalleVenta: z.array(DetalleVentaSchema),
  generaIVA: z.boolean(),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type VentaAttributes = z.infer<typeof VentaSchema>;
export type VentaCreationAttributes = Omit<VentaAttributes, "id" | "createdAt" | "updatedAt">;
