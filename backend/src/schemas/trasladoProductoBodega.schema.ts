import { z } from "zod";

export const TrasladoProductoBodegaSchema = z.object({
  id: z.number().int().positive().optional(),
  usuarioAutoriza: z.number().int().positive(),
  usuarioEncargado: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TrasladoProductoBodegaAttributes = z.infer<typeof TrasladoProductoBodegaSchema>;
export type TrasladoProductoBodegaCreationAttributes = Omit<TrasladoProductoBodegaAttributes, "id" | "createdAt" | "updatedAt">;
