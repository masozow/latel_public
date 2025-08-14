"use client"

import { TrendingUp, Package, ArrowUpDown } from "lucide-react"
import { Plus, List, BarChart3 } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function InventoryMovementsPage() {
  const stats = [
    {
      title: "Movimientos Hoy",
      value: 24,
      description: "transacciones registradas",
      icon: ArrowUpDown,
      trend: {
        value: "+8 vs ayer",
        isPositive: true,
        icon: TrendingUp,
      },
    },
    {
      title: "Entradas",
      value: 156,
      description: "productos ingresados",
      icon: Package,
      variant: "success" as const,
    },
    {
      title: "Salidas",
      value: 89,
      description: "productos despachados",
      icon: Package,
    },
    {
      title: "Transferencias",
      value: 12,
      description: "entre bodegas",
      icon: TrendingUp,
    },
  ]

  const quickActions = [
    {
      title: "Ver Movimientos",
      description: "Historial completo de transacciones",
      href: "/inventory-movements/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nuevo Movimiento",
      description: "Registrar entrada, salida o transferencia",
      href: "/inventory-movements/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Análisis de movimientos de inventario",
      href: "/reports/inventory",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Movimientos Recientes",
    description: "Últimas transacciones registradas",
    items: [
      {
        title: "Entrada - Compra PUR-001",
        description: "50 unidades de Laptop Dell XPS 13",
        badge: "Entrada",
      },
      {
        title: "Salida - Venta INV-002",
        description: "2 unidades de Mouse Logitech",
        badge: "Salida",
      },
      {
        title: "Transferencia - Bodega A → B",
        description: "10 unidades de Teclado RGB",
        badge: "Transfer",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Movimientos de Inventario"
      description="Control y seguimiento de entradas, salidas y transferencias"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
