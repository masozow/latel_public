import { z } from "zod";

// Schema Zod
export const BodegaSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionBodega: z.string().min(1), // Obligatorio
  ubicacionBodega: z.string().optional().nullable(),
  estadoId: z.number().int().positive(), // Obligatorio
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});


export type BodegaAttributes = z.infer<typeof BodegaSchema>;

export type BodegaCreationAttributes = Omit<
  BodegaAttributes,
  "id" | "createdAt" | "updatedAt"
>;
