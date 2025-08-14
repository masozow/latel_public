import * as z from "zod"
// Esquema de validación para el formulario de cliente
export const customerSchema = z.object({
  Nombre: z.string().min(1, "El nombre es requerido").max(150, "El nombre es demasiado largo"),
  Direccion: z.string().max(300, "La dirección es demasiado larga").optional(),
  Telefono: z.string().max(45, "El teléfono es demasiado largo").optional(),
  CorreoElectronico: z.string().email("Correo electrónico inválido").max(45, "El correo es demasiado largo").optional(),
  NITCliente: z.string().min(1, "El NIT es requerido").max(13, "El NIT es demasiado largo"),
  TipoCliente_Id: z.number().min(1, "Debe seleccionar un tipo de cliente"),
  TieneCreditoCliente: z.boolean().default(false),
  SaldoCreditoCliente: z.number().min(0, "El saldo no puede ser negativo").default(0),
  MontoLimiteCreditoCliente: z.number().min(0, "El límite de crédito no puede ser negativo").default(0),
})

export type CustomerFormData = z.infer<typeof customerSchema>
