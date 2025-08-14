"use client"

import { ShoppingCart, DollarSign, Users, TrendingUp } from "lucide-react"
import { List, Plus, BarChart3 } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function SalesPage() {
  const stats = [
    {
      title: "Ventas Hoy",
      value: 24,
      description: "transacciones del día",
      icon: ShoppingCart,
      trend: {
        value: "+8 vs ayer",
        isPositive: true,
        icon: TrendingUp,
      },
    },
    {
      title: "Ingresos Hoy",
      value: "$45,231",
      description: "facturación del día",
      icon: DollarSign,
      variant: "success" as const,
    },
    {
      title: "Clientes Atendidos",
      value: 18,
      description: "clientes únicos",
      icon: Users,
    },
    {
      title: "Ticket Promedio",
      value: "$1,885",
      description: "venta promedio",
      icon: TrendingUp,
      variant: "success" as const,
    },
  ]

  const quickActions = [
    {
      title: "Ver Ventas",
      description: "Historial completo de transacciones",
      href: "/sales/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nueva Venta",
      description: "Procesar venta en punto de venta",
      href: "/pos",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Análisis de ventas y tendencias",
      href: "/reports/sales",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Ventas Recientes",
    description: "Últimas transacciones procesadas",
    items: [
      {
        title: "INV-003 - Carlos López",
        description: "Venta corporativa - $2,336.00",
        badge: "Completada",
        href: "/sales/3",
      },
      {
        title: "INV-002 - María García",
        description: "Venta a crédito - $1,032.98",
        badge: "Pendiente",
        href: "/sales/2",
      },
      {
        title: "INV-001 - Juan Pérez",
        description: "Venta en efectivo - $1,400.00",
        badge: "Completada",
        href: "/sales/1",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Ventas"
      description="Gestión completa de ventas y transacciones"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
