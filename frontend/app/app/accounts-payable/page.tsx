"use client"

import { DollarSign, Building2, Clock } from "lucide-react"
import { Plus, List, BarChart3 } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function AccountsPayablePage() {
  const stats = [
    {
      title: "Cuentas Pendientes",
      value: 23,
      description: "facturas por pagar",
      icon: DollarSign,
    },
    {
      title: "Total por Pagar",
      value: "$89,750",
      description: "saldo pendiente",
      icon: DollarSign,
      variant: "warning" as const,
    },
    {
      title: "Proveedores",
      value: 12,
      description: "con saldo pendiente",
      icon: Building2,
    },
    {
      title: "Próximos Vencimientos",
      value: 5,
      description: "en los próximos 7 días",
      icon: Clock,
      variant: "warning" as const,
    },
  ]

  const quickActions = [
    {
      title: "Ver Cuentas",
      description: "Lista completa de cuentas por pagar",
      href: "/accounts-payable/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nueva Cuenta",
      description: "Registrar nueva cuenta por pagar",
      href: "/accounts-payable/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Análisis de cuentas por pagar",
      href: "/reports/payable",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ]

  const alerts = {
    title: "Próximos Vencimientos",
    description: "Cuentas que vencen en los próximos días",
    variant: "warning" as const,
    items: [
      {
        title: "TechCorp Solutions - PUR-001",
        description: "Vence en 3 días - $5,800.00",
        badge: "Urgente",
        variant: "warning" as const,
      },
      {
        title: "Office Supplies Inc - PUR-003",
        description: "Vence en 5 días - $1,392.00",
        badge: "Próximo",
        variant: "warning" as const,
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Cuentas por Pagar"
      description="Gestión de obligaciones financieras con proveedores"
      stats={stats}
      quickActions={quickActions}
      alerts={alerts}
    />
  )
}
