"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Plus } from "lucide-react"
import type { Customer } from "@/types/database"
import { useRouter } from "next/navigation" // Importar useRouter

interface CustomerSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectCustomer: (customer: Customer | null) => void
}

// Datos de ejemplo
const sampleCustomers: Customer[] = [
  {
    id: 1,
    code: "CLI001",
    name: "Juan Pérez",
    email: "juan@email.com",
    phone: "555-0123",
    address: "Calle 123, Ciudad",
    city: "Ciudad",
    credit_limit: 5000,
    current_debt: 1200,
    active: true,
    created_at: new Date(),
  },
  {
    id: 2,
    code: "CLI002",
    name: "María García",
    email: "maria@email.com",
    phone: "555-0124",
    address: "Avenida 456, Ciudad",
    city: "Ciudad",
    credit_limit: 3000,
    current_debt: 0,
    active: true,
    created_at: new Date(),
  },
]

export function CustomerSelectDialog({ open, onOpenChange, onSelectCustomer }: CustomerSelectDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter() // Inicializar useRouter

  const filteredCustomers = sampleCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleNewCustomerClick = () => {
    onOpenChange(false) // Cerrar el diálogo actual
    router.push("/customers/new") // Redirigir a la página de nuevo cliente
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Seleccionar Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nombre, código o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleNewCustomerClick}>
              <Plus className="h-4 w-4" />
              Nuevo
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {/* Cliente general */}
            <div
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
              onClick={() => {
                onSelectCustomer(null)
                onOpenChange(false)
              }}
            >
              <div className="flex-1">
                <h4 className="font-medium">Cliente General</h4>
                <p className="text-sm text-muted-foreground">Venta sin cliente específico</p>
              </div>
              <Button size="sm">Seleccionar</Button>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No se encontraron clientes</p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    onSelectCustomer(customer)
                    onOpenChange(false)
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{customer.name}</h4>
                      <Badge variant="outline">{customer.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm">Límite: ${customer.credit_limit.toFixed(2)}</span>
                      <span className={`text-sm ${customer.current_debt > 0 ? "text-red-600" : "text-green-600"}`}>
                        Deuda: ${customer.current_debt.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button size="sm">Seleccionar</Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
