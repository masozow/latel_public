"use client"

import { Receipt, FileText, Archive } from "lucide-react"
import { Plus, List, Download } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function ReceiptsPage() {
  const stats = [
    {
      title: "Comprobantes Hoy",
      value: 18,
      description: "documentos generados",
      icon: Receipt,
    },
    {
      title: "Facturas",
      value: 156,
      description: "facturas emitidas",
      icon: FileText,
    },
    {
      title: "Recibos",
      value: 89,
      description: "recibos de pago",
      icon: Receipt,
    },
    {
      title: "Archivados",
      value: 1250,
      description: "documentos históricos",
      icon: Archive,
    },
  ]

  const quickActions = [
    {
      title: "Ver Comprobantes",
      description: "Lista completa de documentos",
      href: "/receipts/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nuevo Comprobante",
      description: "Generar nuevo documento",
      href: "/receipts/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Descargar Reportes",
      description: "Exportar comprobantes en PDF",
      href: "/receipts/export",
      icon: Download,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Comprobantes Recientes",
    description: "Últimos documentos generados",
    items: [
      {
        title: "Factura INV-003",
        description: "Cliente: Carlos López - $2,336.00",
        badge: "Factura",
      },
      {
        title: "Recibo REC-001",
        description: "Pago de Juan Pérez - $1,250.00",
        badge: "Recibo",
      },
      {
        title: "Nota de Crédito NC-001",
        description: "Devolución - $150.00",
        badge: "N. Crédito",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Comprobantes"
      description="Gestión de facturas, recibos y documentos fiscales"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
