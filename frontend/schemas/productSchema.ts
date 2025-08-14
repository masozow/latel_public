import * as z from "zod"

export const productSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  unit_price: z.number().min(0, "El precio debe ser mayor a 0"),
  cost_price: z.number().min(0, "El costo debe ser mayor a 0"),
  stock_quantity: z.number().min(0, "El stock no puede ser negativo"),
  min_stock: z.number().min(0, "El stock mínimo no puede ser negativo"),
  max_stock: z.number().min(1, "El stock máximo debe ser mayor a 0"),
  barcode: z.string().optional(),
  active: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productSchema>