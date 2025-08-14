"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Package } from "lucide-react"
import type { Product } from "@/types/database"

interface ProductSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProduct: (product: Product) => void
  products: Product[]
}

export function ProductSearchDialog({ open, onOpenChange, onSelectProduct, products }: ProductSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda Avanzada de Productos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nombre, código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No se encontraron productos</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{product.name}</h4>
                      <Badge variant="outline">{product.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm">Stock: {product.stock_quantity}</span>
                      <span className="text-sm font-bold text-green-600">${product.unit_price.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button size="sm">Agregar</Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
