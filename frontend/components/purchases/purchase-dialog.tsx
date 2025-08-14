"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Purchase } from "@/types/database";
import { PurchaseFormData, purchaseSchema } from "@/schemas/purchaseSchema";

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase?: Purchase | null;
  onSave: (data: PurchaseFormData) => void;
}

// Datos de ejemplo para proveedores
const sampleSuppliers = [
  { id: 1, name: "TechCorp Solutions" },
  { id: 2, name: "Office Supplies Inc" },
  { id: 3, name: "Electronics Wholesale" },
];

export function PurchaseDialog({
  open,
  onOpenChange,
  purchase,
  onSave,
}: PurchaseDialogProps) {
  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      invoice_number: "",
      supplier_id: 1,
      user_id: 1,
      purchase_date: new Date().toISOString().split("T")[0],
      subtotal: 0,
      tax_amount: 0,
      total_amount: 0,
      status: "pending",
      notes: "",
    },
  });

  const watchSubtotal = form.watch("subtotal");

  // Calcular IVA y total automáticamente
  useEffect(() => {
    const tax = watchSubtotal * 0.16; // 16% IVA
    const total = watchSubtotal + tax;
    form.setValue("tax_amount", tax);
    form.setValue("total_amount", total);
  }, [watchSubtotal, form]);

  useEffect(() => {
    if (purchase) {
      form.reset({
        invoice_number: purchase.invoice_number,
        supplier_id: purchase.supplier_id,
        user_id: purchase.user_id,
        purchase_date: purchase.purchase_date.toISOString().split("T")[0],
        subtotal: purchase.subtotal,
        tax_amount: purchase.tax_amount,
        total_amount: purchase.total_amount,
        status: purchase.status,
        notes: purchase.notes,
      });
    } else {
      form.reset({
        invoice_number: "",
        supplier_id: 1,
        user_id: 1,
        purchase_date: new Date().toISOString().split("T")[0],
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
        status: "pending",
        notes: "",
      });
    }
  }, [purchase, form]);

  const onSubmit = (data: PurchaseFormData) => {
    onSave({
      ...data,
      purchase_date: new Date(data.purchase_date),
    });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {purchase ? "Editar Compra" : "Nueva Compra"}
          </DialogTitle>
          <DialogDescription>
            {purchase
              ? "Modifica la información de la compra"
              : "Registra una nueva orden de compra"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="invoice_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Factura *</FormLabel>
                    <FormControl>
                      <Input placeholder="PUR-001" {...field} />
                    </FormControl>
                    <FormDescription>
                      Número único de la factura
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Compra *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proveedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleSuppliers.map((supplier) => (
                          <SelectItem
                            key={supplier.id}
                            value={supplier.id.toString()}
                          >
                            {supplier.name}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="received">Recibida</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="subtotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtotal *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>Monto antes de impuestos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IVA (16%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value.toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormDescription>Calculado automáticamente</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value.toFixed(2)}
                        readOnly
                        className="bg-muted font-bold"
                      />
                    </FormControl>
                    <FormDescription>Subtotal + IVA</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales sobre la compra..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {purchase ? "Actualizar" : "Crear"} Compra
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
