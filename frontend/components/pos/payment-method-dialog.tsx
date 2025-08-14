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
import { CreditCard, Banknote, Smartphone, Building } from "lucide-react";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment: (method: string, amount: number) => void;
  remainingAmount: number;
}

export const PaymentMethodDialog = ({
  open,
  onOpenChange,
  onAddPayment,
  remainingAmount,
}: PaymentMethodDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amount, setAmount] = useState(remainingAmount.toString());

  const handleAddPayment = () => {
    const paymentAmount = Number.parseFloat(amount);
    if (paymentAmount > 0) {
      const methodNames = {
        cash: "Efectivo",
        card: "Tarjeta",
        transfer: "Transferencia",
        deposit: "Depósito Bancario",
      };

      onAddPayment(
        methodNames[paymentMethod as keyof typeof methodNames],
        paymentAmount
      );
      setAmount("0");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Agregar Método de Pago
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium">
              Monto Pendiente:{" "}
              <span className="font-bold  text-red-500">
                Q{remainingAmount.toFixed(2)}
              </span>
            </Label>
          </div>

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
                  Tarjeta de Crédito/Débito
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Transferencia Electrónica
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deposit" id="deposit" />
                <Label htmlFor="deposit" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Depósito Bancario
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto a Pagar</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddPayment}
              disabled={Number.parseFloat(amount) <= 0}
            >
              Agregar Pago
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
