import { z } from "zod";

export const ProveedorSchema = z.object({
  id: z.number().int().positive().optional(),
  nitProveedor: z.string().optional().nullable(),
  ubicacionProveedor: z.string().optional().nullable(),
  entidadId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ProveedorAttributes = z.infer<typeof ProveedorSchema>;
export type ProveedorCreationAttributes = Omit<ProveedorAttributes, "id" | "createdAt" | "updatedAt">;
