"use client"

import { Shield, Settings, Users, Lock } from "lucide-react"
import { Plus, List, UserCheck } from "lucide-react"
import { ModuleHomepage } from "@/components/module-homepage"

export default function RolesPage() {
  const stats = [
    {
      title: "Roles Definidos",
      value: 5,
      description: "roles en el sistema",
      icon: Shield,
    },
    {
      title: "Permisos",
      value: 24,
      description: "permisos configurados",
      icon: Lock,
    },
    {
      title: "Usuarios Asignados",
      value: 12,
      description: "con roles activos",
      icon: Users,
    },
    {
      title: "Configuraciones",
      value: 8,
      description: "módulos protegidos",
      icon: Settings,
    },
  ]

  const quickActions = [
    {
      title: "Ver Roles",
      description: "Lista completa de roles y permisos",
      href: "/roles/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nuevo Rol",
      description: "Crear nuevo rol con permisos",
      href: "/roles/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Asignar Usuarios",
      description: "Gestionar asignación de roles",
      href: "/users/list",
      icon: UserCheck,
      variant: "outline" as const,
    },
  ]

  const recentItems = {
    title: "Roles del Sistema",
    description: "Roles configurados actualmente",
    items: [
      {
        title: "Administrador",
        description: "Acceso completo al sistema - 3 usuarios",
        badge: "Admin",
      },
      {
        title: "Vendedor",
        description: "POS y gestión de ventas - 8 usuarios",
        badge: "Ventas",
      },
      {
        title: "Supervisor",
        description: "Inventario y reportes - 1 usuario",
        badge: "Supervisor",
      },
    ],
  }

  return (
    <ModuleHomepage
      title="Roles y Permisos"
      description="Configuración de roles de usuario y control de acceso"
      stats={stats}
      quickActions={quickActions}
      recentItems={recentItems}
    />
  )
}
