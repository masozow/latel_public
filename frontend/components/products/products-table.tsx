"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Product } from "@/types/database"

interface ProductsTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: number) => void
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  const handleDelete = () => {
    if (deleteProduct) {
      onDelete(deleteProduct.id)
      setDeleteProduct(null)
    }
  }

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity <= product.min_stock) {
      return { label: "Bajo", variant: "destructive" as const }
    }
    if (product.stock_quantity >= product.max_stock) {
      return { label: "Alto", variant: "secondary" as const }
    }
    return { label: "Normal", variant: "default" as const }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[8rem]">Código</TableHead>
              <TableHead className="min-w-[12rem]">Producto</TableHead>
              <TableHead className="min-w-[8rem] text-right">Precio</TableHead>
              <TableHead className="min-w-[6rem] text-center">Stock</TableHead>
              <TableHead className="min-w-[6rem] text-center">Estado</TableHead>
              <TableHead className="min-w-[8rem] text-right">Valor Total</TableHead>
              <TableHead className="w-[4rem] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const stockStatus = getStockStatus(product)
                const totalValue = product.stock_quantity * product.cost_price

                return (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      <Badge variant="outline">{product.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium leading-none">{product.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <p className="font-medium">${product.unit_price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Costo: ${product.cost_price.toFixed(2)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <p className="font-medium">{product.stock_quantity}</p>
                        <p className="text-xs text-muted-foreground">
                          Min: {product.min_stock} | Max: {product.max_stock}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">${totalValue.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteProduct(product)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto{" "}
              <strong>{deleteProduct?.name}</strong> del inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
