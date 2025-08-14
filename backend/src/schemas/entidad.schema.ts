import { z } from "zod";

export const EntidadSchema = z.object({
  id: z.number().int().positive().optional(),
  nombre: z.string().min(1),
  direccion: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type EntidadAttributes = z.infer<typeof EntidadSchema>;
export type EntidadCreationAttributes = Omit<EntidadAttributes, "id" | "createdAt" | "updatedAt">;
