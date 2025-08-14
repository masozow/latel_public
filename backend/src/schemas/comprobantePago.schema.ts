import { z } from "zod";

export const ComprobantePagoSchema = z.object({
  id: z.bigint().positive().optional(),
  numeroDocumentoComprobantePago: z.string().optional().nullable(),
  serieDocumentoComprobantePago: z.string().optional().nullable(),
  codigoIdentificadorComprobantePago: z.string().optional().nullable(),
  fechaDocumentoComprobantePago: z.date(),
  entidadBancariaId: z.number().int().positive().optional().nullable(),
  montoComprobantePago: z.number().positive(),
  anotacionComprobantePago: z.string().optional().nullable(),
  estadoId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ComprobantePagoAttributes = z.infer<typeof ComprobantePagoSchema>;
export type ComprobantePagoCreationAttributes = Omit<ComprobantePagoAttributes, "id" | "createdAt" | "updatedAt">;
