import * as z from "zod"

export const purchaseSchema = z.object({
  invoice_number: z.string().min(1, "El número de factura es requerido"),
  supplier_id: z.number().min(1, "Debe seleccionar un proveedor"),
  user_id: z.number().min(1, "Usuario requerido"),
  purchase_date: z.string().min(1, "La fecha es requerida"),
  subtotal: z.number().min(0, "El subtotal debe ser mayor a 0"),
  tax_amount: z.number().min(0, "El IVA no puede ser negativo"),
  total_amount: z.number().min(0, "El total debe ser mayor a 0"),
  status: z.enum(["pending", "received", "cancelled"]),
  notes: z.string().optional(),
})

export type PurchaseFormData = z.infer<typeof purchaseSchema>