import { z } from "zod";

export const RolHasPermisoSchema = z.object({
  id: z.number().int().positive().optional(),
  rolId: z.number().int().positive(),
  permisoId: z.number().int().positive(),
  accesoPermiso: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type RolHasPermisoAttributes = z.infer<typeof RolHasPermisoSchema>;
export type RolHasPermisoCreationAttributes = Omit<RolHasPermisoAttributes, "id" | "createdAt" | "updatedAt">;
