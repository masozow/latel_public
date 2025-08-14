"use client"

import { BarChart3, TrendingUp, PieChart, FileText } from "lucide-react"
import { Eye } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function ReportsPage() {
  const stats = [
    {
      title: "Reportes Disponibles",
      value: 12,
      description: "tipos de reportes",
      icon: BarChart3,
    },
    {
      title: "Generados Hoy",
      value: 8,
      description: "reportes creados",
      icon: FileText,
    },
    {
      title: "Más Solicitado",
      value: "Ventas",
      description: "reporte más usado",
      icon: TrendingUp,
    },
    {
      title: "Formatos",
      value: 3,
      description: "PDF, Excel, CSV",
      icon: PieChart,
    },
  ]

  const quickActions = [
    {
      title: "Reportes de Ventas",
      description: "Análisis de ventas por período",
      href: "/reports/sales",
      icon: Eye,
      variant: "default" as const,
    },
    {
      title: "Reportes de Inventario",
      description: "Estado y movimientos de inventario",
      href: "/reports/inventory",
      icon: Eye,
      variant: "default" as const,
    },
    {
      title: "Reportes Financieros",
      description: "Análisis financiero y contable",
      href: "/reports/financial",
      icon: Eye,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Reportes Populares",
    description: "Reportes más utilizados del sistema",
    items: [
      {
        title: "Ventas por Mes",
        description: "Análisis mensual de ventas y tendencias",
        badge: "Popular",
        href: "/reports/sales",
      },
      {
        title: "Stock Bajo",
        description: "Productos que requieren reabastecimiento",
        badge: "Crítico",
        href: "/reports/inventory",
      },
      {
        title: "Cartera de Clientes",
        description: "Estado de cuentas por cobrar",
        badge: "Financiero",
        href: "/reports/financial",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Reportes y Análisis"
      description="Generación de reportes y análisis de datos del sistema"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
