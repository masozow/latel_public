import { z } from "zod";

export const MarcaSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionMarca: z.string().min(1),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type MarcaAttributes = z.infer<typeof MarcaSchema>;
export type MarcaCreationAttributes = Omit<MarcaAttributes, "id" | "createdAt" | "updatedAt">;
