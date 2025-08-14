"use client";

import { Package, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import { Plus, List, BarChart3 } from "lucide-react";
import { ModuleHomepage } from "@/components/module-homepage";

// Datos de ejemplo (en una app real vendrían de la base de datos)
const sampleProducts = [
  {
    id: 1,
    name: "Laptop Dell XPS 13",
    code: "LAP001",
    stock_quantity: 15,
    min_stock: 5,
    unit_price: 1299.99,
    cost_price: 999.99,
  },
  {
    id: 2,
    name: "Mouse Logitech MX Master 3",
    code: "MOU001",
    stock_quantity: 25,
    min_stock: 10,
    unit_price: 99.99,
    cost_price: 69.99,
  },
  {
    id: 3,
    name: "Teclado Mecánico RGB",
    code: "KEY001",
    stock_quantity: 3,
    min_stock: 8,
    unit_price: 149.99,
    cost_price: 99.99,
  },
];

export default function ProductsPage() {
  const lowStockProducts = sampleProducts.filter(
    (product) => product.stock_quantity <= product.min_stock
  );
  const totalValue = sampleProducts.reduce(
    (sum, product) => sum + product.stock_quantity * product.cost_price,
    0
  );
  const averageMargin =
    sampleProducts.reduce(
      (sum, product) =>
        sum +
        ((product.unit_price - product.cost_price) / product.cost_price) * 100,
      0
    ) / sampleProducts.length;

  const stats = [
    {
      title: "Total Productos",
      value: sampleProducts.length,
      description: "productos activos",
      icon: Package,
      trend: {
        value: "+12 nuevos esta semana",
        isPositive: true,
        icon: TrendingUp,
      },
    },
    {
      title: "Stock Bajo",
      value: lowStockProducts.length,
      description: "requieren reabastecimiento",
      icon: AlertTriangle,
      variant: "warning" as const,
    },
    {
      title: "Valor Inventario",
      value: `$${totalValue.toLocaleString()}`,
      description: "costo total",
      icon: DollarSign,
      trend: {
        value: "+5.2% vs mes anterior",
        isPositive: true,
        icon: TrendingUp,
      },
    },
    {
      title: "Margen Promedio",
      value: `${averageMargin.toFixed(1)}%`,
      description: "ganancia promedio",
      icon: BarChart3,
      variant: "success" as const,
    },
  ];

  const quickActions = [
    {
      title: "Ver Listado",
      description: "Explorar todos los productos del inventario",
      href: "/app/products/list",
      icon: List,
      variant: "default" as const,
    },
    {
      title: "Nuevo Producto",
      description: "Agregar un producto al inventario",
      href: "/app/products/new",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Reportes",
      description: "Ver análisis y reportes de productos",
      href: "/app/reports/inventory",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ];

  const alerts =
    lowStockProducts.length > 0
      ? {
          title: "Productos con Stock Bajo",
          description: "Los siguientes productos necesitan reabastecimiento",
          variant: "warning" as const,
          items: lowStockProducts.map((product) => ({
            title: product.name,
            description: `Stock: ${product.stock_quantity} / Mín: ${product.min_stock}`,
            badge: product.code,
            variant: "destructive" as const,
          })),
        }
      : undefined;

  const recentItems = {
    title: "Productos Recientes",
    description: "Últimos productos agregados al inventario",
    items: sampleProducts.slice(0, 3).map((product) => ({
      title: product.name,
      description: `${product.code} - $${product.unit_price.toFixed(2)}`,
      badge: `Stock: ${product.stock_quantity}`,
      href: `/app/products/${product.id}`,
    })),
  };

  return (
    <ModuleHomepage
      title="Productos"
      description="Gestión completa del inventario de productos"
      stats={stats}
      quickActions={quickActions}
      alerts={alerts}
      recentItems={recentItems}
    />
  );
}
