"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Banknote, Smartphone, Receipt } from "lucide-react";
import type { POSTransaction } from "@/types/database";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: POSTransaction;
  onComplete: () => void;
}

export const PaymentDialog = ({
  open,
  onOpenChange,
  transaction,
  onComplete,
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [receivedAmount, setReceivedAmount] = useState(
    transaction.total.toString()
  );
  const [processing, setProcessing] = useState(false);

  const change = Number.parseFloat(receivedAmount) - transaction.total;

  const handlePayment = async () => {
    setProcessing(true);

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Aquí iría la lógica para guardar la venta en la base de datos
    console.log("Procesando pago:", {
      ...transaction,
      payment_method: paymentMethod,
      received_amount: Number.parseFloat(receivedAmount),
      change_amount: change,
    });

    setProcessing(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Procesar Pago
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen de la venta */}
          <div className="space-y-2">
            <h3 className="font-medium">Resumen de Venta</h3>
            <div className="bg-muted/50 p-3 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${transaction.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA:</span>
                <span>${transaction.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${transaction.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div className="space-y-3">
            <Label>Método de Pago</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Efectivo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Tarjeta
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Transferencia
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Monto recibido (solo para efectivo) */}
          {paymentMethod === "cash" && (
            <div className="space-y-2">
              <Label htmlFor="received">Monto Recibido</Label>
              <Input
                id="received"
                type="number"
                step="0.01"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
              />
              {change >= 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Cambio: </span>
                  <span className="font-bold text-green-600">
                    ${change.toFixed(2)}
                  </span>
                </div>
              )}
              {change < 0 && (
                <div className="text-sm text-red-600">Monto insuficiente</div>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handlePayment}
              disabled={processing || (paymentMethod === "cash" && change < 0)}
            >
              {processing ? (
                "Procesando..."
              ) : (
                <>
                  <Receipt className="h-4 w-4 mr-2" />
                  Completar Venta
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
