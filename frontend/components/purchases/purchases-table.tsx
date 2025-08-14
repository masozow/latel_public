"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, MoreHorizontal, Package } from "lucide-react"
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
import type { Purchase } from "@/types/database"

interface PurchasesTableProps {
  purchases: Purchase[]
  onEdit: (purchase: Purchase) => void
  onDelete: (purchaseId: number) => void
}

export function PurchasesTable({ purchases, onEdit, onDelete }: PurchasesTableProps) {
  const [deletePurchase, setDeletePurchase] = useState<Purchase | null>(null)

  const handleDelete = () => {
    if (deletePurchase) {
      onDelete(deletePurchase.id)
      setDeletePurchase(null)
    }
  }

  const getStatusBadge = (status: Purchase["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      case "received":
        return <Badge variant="default">Recibida</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[8rem]">Factura</TableHead>
              <TableHead className="min-w-[8rem]">Fecha</TableHead>
              <TableHead className="min-w-[8rem]">Proveedor</TableHead>
              <TableHead className="min-w-[8rem] text-right">Subtotal</TableHead>
              <TableHead className="min-w-[6rem] text-right">IVA</TableHead>
              <TableHead className="min-w-[8rem] text-right">Total</TableHead>
              <TableHead className="min-w-[6rem] text-center">Estado</TableHead>
              <TableHead className="w-[4rem] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron compras</p>
                </TableCell>
              </TableRow>
            ) : (
              purchases.map((purchase) => (
                <TableRow key={purchase.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">
                    <Badge variant="outline">{purchase.invoice_number}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{purchase.purchase_date.toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {purchase.purchase_date.toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">Proveedor #{purchase.supplier_id}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{purchase.notes}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="font-medium">${purchase.subtotal.toFixed(2)}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="font-medium">${purchase.tax_amount.toFixed(2)}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="font-bold text-lg">${purchase.total_amount.toFixed(2)}</p>
                  </TableCell>
                  <TableCell className="text-center">{getStatusBadge(purchase.status)}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(purchase)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeletePurchase(purchase)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!deletePurchase} onOpenChange={() => setDeletePurchase(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la compra{" "}
              <strong>{deletePurchase?.invoice_number}</strong>.
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
