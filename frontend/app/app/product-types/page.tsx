"use client"

import { Layers, Package, Tag } from "lucide-react"
import { Plus, List, BarChart3 } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function ProductTypesPage() {
  const stats = [
    {
      title: "Tipos Definidos",
      value: 8,
      description: "tipos de productos",
      icon: Layers,
    },
    {
      title: "Productos Asignados",
      value: 156,
      description: "productos categorizados",
      icon: Package,
    },
    {
      title: "Más Usado",
      value: "Electrónicos",
      description: "tipo más popular",
      icon: Tag,
      variant: "success" as const,
    },
    {
      title: "Sin Asignar",
      value: 3,
      description: "productos sin tipo",
      icon: Package,
      variant: "warning" as const,
    },
  ]

  const quickActions = [
    {
      title: "Ver Tipos",
      description: "Lista completa de tipos de productos",
      href: "/product-types/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nuevo Tipo",
      description: "Crear nuevo tipo de producto",
      href: "/product-types/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Análisis por tipos de productos",
      href: "/reports/product-types",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Tipos Populares",
    description: "Tipos de productos más utilizados",
    items: [
      {
        title: "Electrónicos",
        description: "Laptops, tablets, smartphones - 45 productos",
        badge: "Popular",
      },
      {
        title: "Accesorios",
        description: "Mouse, teclados, cables - 32 productos",
        badge: "Activo",
      },
      {
        title: "Oficina",
        description: "Papelería, mobiliario - 28 productos",
        badge: "Activo",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Tipos de Producto"
      description="Clasificación y categorización de productos por tipo"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
