"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerFormData, customerSchema } from "@/schemas/customerSchema";

interface CustomerFormProps {
  initialData?: Partial<CustomerFormData>; // Para edición, si se implementa
  onSave: (data: CustomerFormData) => void;
  onCancel: () => void;
}

// Datos de ejemplo para TipoCliente (en una app real vendrían de la base de datos)
const sampleCustomerTypes = [
  { id: 1, name: "Consumidor Final" },
  { id: 2, name: "Empresa" },
  { id: 3, name: "Gobierno" },
];

export const CustomerForm = ({
  initialData,
  onSave,
  onCancel,
}: CustomerFormProps) => {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      Nombre: "",
      Direccion: "",
      Telefono: "",
      CorreoElectronico: "",
      NITCliente: "",
      TipoCliente_Id: 1, // Default a Consumidor Final
      TieneCreditoCliente: false,
      SaldoCreditoCliente: 0,
      MontoLimiteCreditoCliente: 0,
      ...initialData, // Cargar datos iniciales si se proporcionan
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        Nombre: "",
        Direccion: "",
        Telefono: "",
        CorreoElectronico: "",
        NITCliente: "",
        TipoCliente_Id: 1,
        TieneCreditoCliente: false,
        SaldoCreditoCliente: 0,
        MontoLimiteCreditoCliente: 0,
      });
    }
  }, [initialData, form]);

  const onSubmit = (data: CustomerFormData) => {
    onSave(data);
    form.reset(); // Opcional: resetear después de guardar
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Editar Cliente" : "Nuevo Cliente"}
        </CardTitle>
        <CardDescription>
          {initialData
            ? "Modifica la información del cliente"
            : "Agrega un nuevo cliente al sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="Nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="NITCliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIT / Identificación *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="C/F o número de identificación"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Número de Identificación Tributaria o Consumidor Final
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="Direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Dirección física del cliente"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="Telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CorreoElectronico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="TipoCliente_Id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cliente *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sampleCustomerTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="TieneCreditoCliente"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Tiene Crédito</FormLabel>
                    <FormDescription>
                      Indica si el cliente puede acceder a crédito.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("TieneCreditoCliente") && (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="MontoLimiteCreditoCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Límite de Crédito</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Monto máximo de crédito permitido.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="SaldoCreditoCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldo Actual de Crédito</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          readOnly // Generalmente el saldo no se edita directamente
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormDescription>
                        Saldo pendiente del cliente (solo lectura).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto bg-transparent"
              >
                Cancelar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {initialData ? "Actualizar" : "Crear"} Cliente
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
