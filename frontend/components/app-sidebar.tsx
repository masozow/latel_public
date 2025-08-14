"use client";

import type * as React from "react";
import {
  Package,
  ShoppingCart,
  Users,
  Truck,
  Warehouse,
  CreditCard,
  BarChart3,
  Settings,
  Calculator,
  Home,
  UserCheck,
  Building2,
  Receipt,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Plus,
  List,
  Tag,
  Layers,
  Bookmark,
  Banknote,
  Building,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

// Configuración de menús con submenús
const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/app",
  },
  {
    title: "Punto de Venta (POS)",
    icon: Calculator,
    url: "/app/pos",
  },
];

const inventoryItems = [
  {
    title: "Productos",
    icon: Package,
    url: "/app/products",
    subItems: [
      { title: "Inicio", url: "/app/products", icon: Home },
      { title: "Listado", url: "/app/products/list", icon: List },
      { title: "Nuevo", url: "/app/products/new", icon: Plus },
    ],
  },
  {
    title: "Características Producto",
    icon: Tag,
    url: "/app/product-features",
    subItems: [
      {
        title: "Tipo",
        url: "/app/product-types",
        icon: Layers,
        subItems: [
          { title: "Inicio", url: "/app/product-types", icon: Home },
          { title: "Listado", url: "/app/product-types/list", icon: List },
          { title: "Nuevo", url: "/app/product-types/new", icon: Plus },
        ],
      },
      {
        title: "Marca",
        url: "/app/brands",
        icon: Bookmark,
        subItems: [
          { title: "Inicio", url: "/app/brands", icon: Home },
          { title: "Listado", url: "/app/brands/list", icon: List },
          { title: "Nueva", url: "/app/brands/new", icon: Plus },
        ],
      },
      {
        title: "Línea",
        url: "/app/product-lines",
        icon: TrendingUp,
        subItems: [
          { title: "Inicio", url: "/app/product-lines", icon: Home },
          { title: "Listado", url: "/app/product-lines/list", icon: List },
          { title: "Nueva", url: "/app/product-lines/new", icon: Plus },
        ],
      },
    ],
  },
  {
    title: "Bodegas",
    icon: Warehouse,
    url: "/app/warehouses",
    subItems: [
      { title: "Inicio", url: "/app/warehouses", icon: Home },
      { title: "Listado", url: "/app/warehouses/list", icon: List },
      {
        title: "Movimientos",
        url: "/app/warehouses/movements",
        icon: TrendingUp,
        subItems: [
          { title: "Nuevo", url: "/app/warehouses/movements/new", icon: Plus },
          {
            title: "Listado",
            url: "/app/warehouses/movements/list",
            icon: List,
          },
        ],
      },
    ],
  },
  {
    title: "Movimientos",
    icon: TrendingUp,
    url: "/app/inventory-movements",
    subItems: [
      { title: "Inicio", url: "/app/inventory-movements", icon: Home },
      { title: "Listado", url: "/app/inventory-movements/list", icon: List },
      { title: "Nuevo", url: "/app/inventory-movements/new", icon: Plus },
    ],
  },
];

const salesItems = [
  {
    title: "Ventas",
    icon: ShoppingCart,
    url: "/app/sales",
    subItems: [
      { title: "Inicio", url: "/app/sales", icon: Home },
      { title: "Listado", url: "/app/sales/list", icon: List },
      { title: "Nueva", url: "/app/pos", icon: Plus },
    ],
  },
  {
    title: "Clientes",
    icon: Users,
    url: "/app/customers",
    subItems: [
      { title: "Inicio", url: "/app/customers", icon: Home },
      { title: "Listado", url: "/app/customers/list", icon: List },
      { title: "Nuevo", url: "/app/customers/new", icon: Plus }, // Enlace a la nueva página
    ],
  },
  {
    title: "Créditos",
    icon: CreditCard,
    url: "/app/credits",
    subItems: [
      { title: "Inicio", url: "/app/credits", icon: Home },
      { title: "Listado", url: "/app/credits/list", icon: List },
      { title: "Nuevo", url: "/app/credits/new", icon: Plus },
    ],
  },
];

const purchaseItems = [
  {
    title: "Compras",
    icon: Truck,
    url: "/app/purchases",
    subItems: [
      { title: "Inicio", url: "/app/purchases", icon: Home },
      { title: "Listado", url: "/app/purchases/list", icon: List },
      { title: "Nueva", url: "/app/purchases/new", icon: Plus },
    ],
  },
  {
    title: "Proveedores",
    icon: Building2,
    url: "/app/suppliers",
    subItems: [
      { title: "Inicio", url: "/app/suppliers", icon: Home },
      { title: "Listado", url: "/app/suppliers/list", icon: List },
      { title: "Nuevo", url: "/app/suppliers/new", icon: Plus },
    ],
  },
  {
    title: "Cuentas por Pagar",
    icon: DollarSign,
    url: "/app/accounts-payable",
    subItems: [
      { title: "Inicio", url: "/app/accounts-payable", icon: Home },
      { title: "Listado", url: "/app/accounts-payable/list", icon: List },
      { title: "Nueva", url: "/app/accounts-payable/new", icon: Plus },
    ],
  },
];

const adminItems = [
  {
    title: "Usuarios",
    icon: UserCheck,
    url: "/app/users",
    subItems: [
      { title: "Inicio", url: "/app/users", icon: Home },
      { title: "Listado", url: "/app/users/list", icon: List },
      { title: "Nuevo", url: "/app/users/new", icon: Plus },
    ],
  },
  {
    title: "Roles",
    icon: Settings,
    url: "/app/roles",
    subItems: [
      { title: "Inicio", url: "/app/roles", icon: Home },
      { title: "Listado", url: "/app/roles/list", icon: List },
      { title: "Nuevo", url: "/app/roles/new", icon: Plus },
    ],
  },
  {
    title: "Forma de Pago",
    icon: Banknote,
    url: "/app/payment-methods",
    subItems: [
      { title: "Inicio", url: "/app/payment-methods", icon: Home },
      { title: "Listado", url: "/app/payment-methods/list", icon: List },
      { title: "Nueva", url: "/app/payment-methods/new", icon: Plus },
    ],
  },
  {
    title: "Entidad Bancaria",
    icon: Building,
    url: "/app/banks",
    subItems: [
      { title: "Inicio", url: "/app/banks", icon: Home },
      { title: "Listado", url: "/app/banks/list", icon: List },
      { title: "Nueva", url: "/app/banks/new", icon: Plus },
    ],
  },
  {
    title: "Comprobantes",
    icon: Receipt,
    url: "/app/receipts",
    subItems: [
      { title: "Inicio", url: "/app/receipts", icon: Home },
      { title: "Listado", url: "/app/receipts/list", icon: List },
      { title: "Nuevo", url: "/app/receipts/new", icon: Plus },
    ],
  },
  {
    title: "Reportes",
    icon: BarChart3,
    url: "/app/reports",
    subItems: [
      { title: "Inicio", url: "/app/reports", icon: Home },
      { title: "Ventas", url: "/app/reports/sales", icon: ShoppingCart },
      { title: "Inventario", url: "/app/reports/inventory", icon: Package },
      { title: "Financiero", url: "/app/reports/financial", icon: DollarSign },
    ],
  },
];

// Componente para renderizar menús con submenús anidados
function MenuSection({
  items,
  title,
}: {
  items: Array<{
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    url: string;
    subItems?: Array<{
      title: string;
      url: string;
      icon: React.ComponentType<{ className?: string }>;
      subItems?: Array<{
        title: string;
        url: string;
        icon: React.ComponentType<{ className?: string }>;
      }>;
    }>;
  }>;
  title?: string;
}) {
  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (item.subItems) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="h-auto"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-visible">
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => {
                          // Si el subItem tiene sus propios subItems (como en Características Producto)
                          if (subItem.subItems) {
                            return (
                              <Collapsible
                                key={subItem.title}
                                asChild
                                defaultOpen={false}
                                className="group/nested-collapsible"
                              >
                                <SidebarMenuSubItem>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton className="w-full">
                                      <subItem.icon />
                                      <span>{subItem.title}</span>
                                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/nested-collapsible:rotate-90" />
                                    </SidebarMenuSubButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="overflow-visible">
                                    <SidebarMenuSub className="ml-4 min-h-0">
                                      {subItem.subItems.map((nestedItem) => (
                                        <SidebarMenuSubItem
                                          key={nestedItem.title}
                                        >
                                          <SidebarMenuSubButton asChild>
                                            <Link href={nestedItem.url}>
                                              <nestedItem.icon />
                                              <span>{nestedItem.title}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </SidebarMenuSubItem>
                              </Collapsible>
                            );
                          }

                          // SubItem normal
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
                                  <subItem.icon />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">LATEL</h1>
            <p className="text-xs text-muted-foreground">
              Sistema de Inventario
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <MenuSection items={menuItems} />
        <MenuSection items={inventoryItems} title="Inventario" />
        <MenuSection items={salesItems} title="Ventas" />
        <MenuSection items={purchaseItems} title="Compras" />
        <MenuSection items={adminItems} title="Administración" />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span>Admin User</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
