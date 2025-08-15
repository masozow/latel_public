import { z } from "zod";

export const CompraSchema = z.object({
  id: z.number().int().positive().optional(),
  proveedorId: z.number().int().positive(),
  bodegaId: z.number().int().positive(), // NUEVO CAMPO
  fechaCompra: z.date(),
  totalCompra: z.number().positive(),
  numeroDocumentoCompra: z.string().optional().nullable(),
  serieDocumentoCompra: z.string().optional().nullable(),
  pagaIVA: z.boolean(),
  compraContadoOCredito: z.boolean(),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CompraAttributes = z.infer<typeof CompraSchema>;
export type CompraCreationAttributes = Omit<CompraAttributes, "id" | "createdAt" | "updatedAt">;
