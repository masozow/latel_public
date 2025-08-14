import { z } from "zod";

export const PermisoSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionPermiso: z.string().min(1),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type PermisoAttributes = z.infer<typeof PermisoSchema>;
export type PermisoCreationAttributes = Omit<PermisoAttributes, "id" | "createdAt" | "updatedAt">;