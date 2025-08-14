"use client"

import { Banknote, CreditCard, Smartphone } from "lucide-react"
import { Plus, List, BarChart3 } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function PaymentMethodsPage() {
  const stats = [
    {
      title: "Métodos Activos",
      value: 6,
      description: "formas de pago disponibles",
      icon: Banknote,
    },
    {
      title: "Más Usado",
      value: "Efectivo",
      description: "método preferido",
      icon: Banknote,
      variant: "success" as const,
    },
    {
      title: "Digitales",
      value: 3,
      description: "métodos electrónicos",
      icon: Smartphone,
    },
    {
      title: "Tradicionales",
      value: 3,
      description: "efectivo y tarjetas",
      icon: CreditCard,
    },
  ]

  const quickActions = [
    {
      title: "Ver Métodos",
      description: "Lista completa de formas de pago",
      href: "/payment-methods/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nueva Forma",
      description: "Agregar nuevo método de pago",
      href: "/payment-methods/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Análisis de uso por método",
      href: "/reports/payment-methods",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Métodos Configurados",
    description: "Formas de pago disponibles en el sistema",
    items: [
      {
        title: "Efectivo",
        description: "Pago en efectivo - Más usado",
        badge: "Popular",
      },
      {
        title: "Tarjeta de Crédito",
        description: "Visa, MasterCard, American Express",
        badge: "Activo",
      },
      {
        title: "Transferencia",
        description: "Transferencia bancaria electrónica",
        badge: "Digital",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Formas de Pago"
      description="Configuración de métodos de pago disponibles"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
