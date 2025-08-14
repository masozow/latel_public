"use client"

import { Building, CreditCard, DollarSign } from "lucide-react"
import { Plus, List, BarChart3 } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function BanksPage() {
  const stats = [
    {
      title: "Bancos Registrados",
      value: 8,
      description: "entidades bancarias",
      icon: Building,
    },
    {
      title: "Cuentas Activas",
      value: 12,
      description: "cuentas configuradas",
      icon: CreditCard,
    },
    {
      title: "Banco Principal",
      value: "Bancolombia",
      description: "más transacciones",
      icon: Building,
      variant: "success" as const,
    },
    {
      title: "Saldo Total",
      value: "$125,450",
      description: "en todas las cuentas",
      icon: DollarSign,
    },
  ]

  const quickActions = [
    {
      title: "Ver Bancos",
      description: "Lista completa de entidades bancarias",
      href: "/banks/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nueva Entidad",
      description: "Registrar nuevo banco o entidad",
      href: "/banks/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Análisis de movimientos bancarios",
      href: "/reports/banks",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Entidades Principales",
    description: "Bancos más utilizados en el sistema",
    items: [
      {
        title: "Bancolombia",
        description: "Cuenta corriente y ahorros - 5 cuentas",
        badge: "Principal",
      },
      {
        title: "Banco de Bogotá",
        description: "Cuenta empresarial - 3 cuentas",
        badge: "Activo",
      },
      {
        title: "Davivienda",
        description: "Cuenta de ahorros - 2 cuentas",
        badge: "Secundario",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Entidades Bancarias"
      description="Gestión de bancos y cuentas financieras"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
