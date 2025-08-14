"use client"

import { Bookmark, Package, Star } from "lucide-react"
import { Plus, List, BarChart3 } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function BrandsPage() {
  const stats = [
    {
      title: "Marcas Registradas",
      value: 15,
      description: "marcas en el sistema",
      icon: Bookmark,
    },
    {
      title: "Productos Asignados",
      value: 189,
      description: "productos con marca",
      icon: Package,
    },
    {
      title: "Marca Líder",
      value: "Dell",
      description: "marca más vendida",
      icon: Star,
      variant: "success" as const,
    },
    {
      title: "Sin Marca",
      value: 12,
      description: "productos genéricos",
      icon: Package,
      variant: "warning" as const,
    },
  ]

  const quickActions = [
    {
      title: "Ver Marcas",
      description: "Lista completa de marcas registradas",
      href: "/brands/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nueva Marca",
      description: "Registrar nueva marca de productos",
      href: "/brands/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Análisis de ventas por marca",
      href: "/reports/brands",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Marcas Principales",
    description: "Marcas con mayor presencia en inventario",
    items: [
      {
        title: "Dell",
        description: "Laptops y equipos de cómputo - 45 productos",
        badge: "Líder",
      },
      {
        title: "Logitech",
        description: "Accesorios y periféricos - 32 productos",
        badge: "Popular",
      },
      {
        title: "HP",
        description: "Impresoras y laptops - 28 productos",
        badge: "Activa",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Marcas"
      description="Gestión de marcas y fabricantes de productos"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
