import { z } from "zod";

export const EntidadBancariaSchema = z.object({
  id: z.number().int().positive().optional(),
  entidadId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type EntidadBancariaAttributes = z.infer<typeof EntidadBancariaSchema>;
export type EntidadBancariaCreationAttributes = Omit<EntidadBancariaAttributes, "id" | "createdAt" | "updatedAt">;

