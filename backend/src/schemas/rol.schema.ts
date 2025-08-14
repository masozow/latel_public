import { z } from "zod";

export const RolSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionRol: z.string().min(1), // Obligatorio
  estadoId: z.number().int().positive(), // Obligatorio
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type RolAttributes = z.infer<typeof RolSchema>;
export type RolCreationAttributes = Omit<RolAttributes, "id" | "createdAt" | "updatedAt">;
