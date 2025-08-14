"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

const Dashboard = () => {
  const { setTitle } = useSidebar();
  useEffect(() => {
    setTitle("Dashboard");
  }, []);
  return (
    <SidebarInset>
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        {/* Métricas principales - Grid responsive */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas del Día
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +20.1% desde ayer
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                45 con stock bajo
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +12 nuevos esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Órdenes Pendientes
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                -4 desde ayer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas y notificaciones - Grid responsive */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Productos con Stock Bajo</CardTitle>
              <CardDescription>
                Productos que necesitan reabastecimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                {[
                  { name: "Laptop Dell XPS 13", stock: 2, min: 5 },
                  { name: "Mouse Logitech MX", stock: 1, min: 10 },
                  { name: "Teclado Mecánico", stock: 3, min: 8 },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {product.stock} / Mínimo: {product.min}
                      </p>
                    </div>
                    <Badge
                      variant="destructive"
                      className="self-start sm:self-center"
                    >
                      Crítico
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Ventas Recientes</CardTitle>
              <CardDescription>
                Últimas transacciones realizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                {[
                  {
                    invoice: "INV-001",
                    customer: "Juan Pérez",
                    amount: 1250.0,
                    status: "Completada",
                  },
                  {
                    invoice: "INV-002",
                    customer: "María García",
                    amount: 890.5,
                    status: "Pendiente",
                  },
                  {
                    invoice: "INV-003",
                    customer: "Carlos López",
                    amount: 2100.0,
                    status: "Completada",
                  },
                ].map((sale, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{sale.invoice}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {sale.customer}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                      <p className="text-sm font-medium">
                        ${sale.amount.toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          sale.status === "Completada" ? "default" : "secondary"
                        }
                        className="self-start sm:self-end"
                      >
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y estadísticas - Grid responsive */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ventas por Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64 lg:h-80 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                Gráfico de ventas mensuales
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "Laptop HP", sales: 45 },
                  { name: "Mouse Inalámbrico", sales: 32 },
                  { name: 'Monitor 24"', sales: 28 },
                  { name: "Teclado USB", sales: 21 },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm truncate flex-1 mr-2">
                      {product.name}
                    </span>
                    <Badge variant="outline">{product.sales}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
};
export default Dashboard;
