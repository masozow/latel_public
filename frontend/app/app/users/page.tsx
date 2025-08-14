"use client"

import { Users, UserCheck, Shield, Clock } from "lucide-react"
import { Plus, List, Settings } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function UsersPage() {
  const stats = [
    {
      title: "Usuarios Activos",
      value: 12,
      description: "usuarios en el sistema",
      icon: Users,
    },
    {
      title: "Administradores",
      value: 3,
      description: "con permisos completos",
      icon: Shield,
      variant: "success" as const,
    },
    {
      title: "Vendedores",
      value: 8,
      description: "usuarios de ventas",
      icon: UserCheck,
    },
    {
      title: "Última Conexión",
      value: "Hace 5 min",
      description: "actividad reciente",
      icon: Clock,
    },
  ]

  const quickActions = [
    {
      title: "Ver Usuarios",
      description: "Lista completa de usuarios del sistema",
      href: "/users/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nuevo Usuario",
      description: "Agregar usuario al sistema",
      href: "/users/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Gestionar Roles",
      description: "Configurar permisos y roles",
      href: "/roles",
      icon: Settings,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Actividad Reciente",
    description: "Últimas acciones de usuarios",
    items: [
      {
        title: "Admin User - Inicio de sesión",
        description: "Hace 5 minutos desde 192.168.1.100",
        badge: "Online",
      },
      {
        title: "Vendedor 1 - Venta procesada",
        description: "INV-003 por $2,336.00 hace 1 hora",
        badge: "Venta",
      },
      {
        title: "Supervisor - Producto agregado",
        description: "Laptop HP Pavilion hace 2 horas",
        badge: "Producto",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Usuarios"
      description="Gestión de usuarios y control de acceso al sistema"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
