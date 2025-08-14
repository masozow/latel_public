"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Sale } from "@/types/database"

interface SalesTableProps {
  sales: Sale[]
}

export function SalesTable({ sales }: SalesTableProps) {
  const getStatusBadge = (status: Sale["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completada</Badge>
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "cash":
        return <Badge variant="outline">Efectivo</Badge>
      case "card":
        return <Badge variant="outline">Tarjeta</Badge>
      case "transfer":
        return <Badge variant="outline">Transferencia</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[8rem]">Factura</TableHead>
            <TableHead className="min-w-[8rem]">Fecha</TableHead>
            <TableHead className="min-w-[8rem]">Cliente</TableHead>
            <TableHead className="min-w-[8rem] text-right">Subtotal</TableHead>
            <TableHead className="min-w-[6rem] text-right">Descuento</TableHead>
            <TableHead className="min-w-[8rem] text-right">Total</TableHead>
            <TableHead className="min-w-[8rem] text-center">Pago</TableHead>
            <TableHead className="min-w-[6rem] text-center">Estado</TableHead>
            <TableHead className="w-[4rem] text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No se encontraron ventas
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-sm">
                  <Badge variant="outline">{sale.invoice_number}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{sale.sale_date.toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.sale_date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">Cliente #{sale.customer_id}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{sale.notes}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-medium">${sale.subtotal.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">+${sale.tax_amount.toFixed(2)} IVA</p>
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-medium text-red-600">
                    {sale.discount_amount > 0 ? `-$${sale.discount_amount.toFixed(2)}` : "-"}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-bold text-lg">${sale.total_amount.toFixed(2)}</p>
                </TableCell>
                <TableCell className="text-center">{getPaymentMethodBadge(sale.payment_method)}</TableCell>
                <TableCell className="text-center">{getStatusBadge(sale.status)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
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
  )
}
