import { z } from "zod";

export const FormaPagoSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcionFormaPago: z.string().min(1),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type FormaPagoAttributes = z.infer<typeof FormaPagoSchema>;
export type FormaPagoCreationAttributes = Omit<FormaPagoAttributes, "id" | "createdAt" | "updatedAt">;
