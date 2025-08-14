"use client"

import { TrendingUp, Package, Target } from "lucide-react"
import { Plus, List, BarChart3 } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function ProductLinesPage() {
  const stats = [
    {
      title: "Líneas Activas",
      value: 12,
      description: "líneas de productos",
      icon: TrendingUp,
    },
    {
      title: "Productos Asignados",
      value: 167,
      description: "productos en líneas",
      icon: Package,
    },
    {
      title: "Línea Principal",
      value: "Gaming",
      description: "línea más rentable",
      icon: Target,
      variant: "success" as const,
    },
    {
      title: "En Desarrollo",
      value: 2,
      description: "nuevas líneas",
      icon: TrendingUp,
      variant: "warning" as const,
    },
  ]

  const quickActions = [
    {
      title: "Ver Líneas",
      description: "Lista completa de líneas de productos",
      href: "/product-lines/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nueva Línea",
      description: "Crear nueva línea de productos",
      href: "/product-lines/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Análisis de rendimiento por línea",
      href: "/reports/product-lines",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Líneas Destacadas",
    description: "Líneas de productos con mejor desempeño",
    items: [
      {
        title: "Gaming",
        description: "Equipos y accesorios gaming - 35 productos",
        badge: "Top",
      },
      {
        title: "Oficina Pro",
        description: "Equipos profesionales - 28 productos",
        badge: "Rentable",
      },
      {
        title: "Básica",
        description: "Productos de entrada - 45 productos",
        badge: "Volumen",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Líneas de Producto"
      description="Organización de productos por líneas comerciales"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
