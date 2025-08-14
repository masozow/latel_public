import { z } from "zod";

export const UsuarioSchema = z.object({
  id: z.number().int().positive().optional(),
  password: z.string().min(1), // obligatorio
  rolId: z.number().int().positive(), // obligatorio
  entidadId: z.number().int().positive(), // obligatorio
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UsuarioAttributes = z.infer<typeof UsuarioSchema>;
export type UsuarioCreationAttributes = Omit<UsuarioAttributes, "id" | "createdAt" | "updatedAt">;
