"use client"

import { CreditCard, DollarSign, Users, AlertTriangle } from "lucide-react"
import { Plus, List, BarChart3 } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function CreditsPage() {
  const stats = [
    {
      title: "Créditos Activos",
      value: 45,
      description: "cuentas por cobrar",
      icon: CreditCard,
    },
    {
      title: "Total por Cobrar",
      value: "$125,450",
      description: "saldo pendiente",
      icon: DollarSign,
      variant: "warning" as const,
    },
    {
      title: "Clientes con Crédito",
      value: 28,
      description: "clientes activos",
      icon: Users,
    },
    {
      title: "Vencidos",
      value: 8,
      description: "créditos vencidos",
      icon: AlertTriangle,
      variant: "destructive" as const,
    },
  ]

  const quickActions = [
    {
      title: "Ver Créditos",
      description: "Lista completa de cuentas por cobrar",
      href: "/credits/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nuevo Crédito",
      description: "Registrar nueva cuenta por cobrar",
      href: "/credits/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Análisis de cartera de clientes",
      href: "/reports/credits",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ]

  const alerts = {
    title: "Créditos Vencidos",
    description: "Cuentas que requieren seguimiento inmediato",
    variant: "destructive" as const,
    items: [
      {
        title: "Juan Pérez - INV-001",
        description: "Vencido hace 15 días - $1,250.00",
        badge: "Crítico",
        variant: "destructive" as const,
      },
      {
        title: "María García - INV-005",
        description: "Vencido hace 8 días - $890.50",
        badge: "Urgente",
        variant: "destructive" as const,
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Créditos"
      description="Gestión de cuentas por cobrar y cartera de clientes"
      stats={stats}
      quickActions={quickActions}
      alerts={alerts}
    />
  )
}
