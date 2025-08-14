import { z } from "zod";

export const ProductoSchema = z.object({
  id: z.number().int().positive().optional(),
  codigoProducto: z.string().min(1),
  descripcionProducto: z.string().min(1),
  anotacionProducto: z.string().optional().nullable(),
  costoProducto: z.number().positive(),
  totalExistenciaProducto: z.number().int().min(0),
  estadoId: z.number().int().positive(),
  marcaId: z.number().int().positive(),
  tipoProductoId: z.number().int().positive(),
  lineaProductoId: z.number().int().positive().optional().nullable(),
  precioPorDefectoId: z.number().int().positive().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ProductoAttributes = z.infer<typeof ProductoSchema>;
export type ProductoCreationAttributes = Omit<ProductoAttributes, "id" | "createdAt" | "updatedAt">;
