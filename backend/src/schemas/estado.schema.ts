import { z } from "zod";

export const EstadoSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionEstado: z.string().min(1),
  activoEstado: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});


export type EstadoAttributes = z.infer<typeof EstadoSchema>;
export type EstadoCreationAttributes = Omit<EstadoAttributes, "id" | "createdAt" | "updatedAt">;
