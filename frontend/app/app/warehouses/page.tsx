"use client";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Warehouse,
  MapPin,
  Activity,
  Plus,
  List,
  BarChart3,
} from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";

// Datos de ejemplo para bodegas
const sampleWarehouses = [
  {
    id: 1,
    code: "BOD001",
    name: "Bodega Principal",
    description: "Bodega central para productos de alta rotación",
    location: "Zona 10, Ciudad de Guatemala",
    status: "active",
    manager_id: 1,
    recentMovements: [
      {
        product: "Laptop Dell XPS 13",
        type: "entrada",
        quantity: 10,
        date: "2024-01-15",
      },
      {
        product: "Mouse Logitech",
        type: "salida",
        quantity: 5,
        date: "2024-01-14",
      },
      {
        product: "Teclado RGB",
        type: "transferencia",
        quantity: 3,
        date: "2024-01-13",
      },
    ],
  },
  {
    id: 2,
    code: "BOD002",
    name: "Bodega Secundaria",
    description: "Almacén para productos de baja rotación y stock de reserva",
    location: "Zona 12, Ciudad de Guatemala",
    status: "active",
    manager_id: 2,
    recentMovements: [
      {
        product: 'Monitor 24"',
        type: "entrada",
        quantity: 8,
        date: "2024-01-12",
      },
      {
        product: "Cables USB",
        type: "salida",
        quantity: 15,
        date: "2024-01-11",
      },
    ],
  },
  {
    id: 3,
    code: "BOD003",
    name: "Bodega de Reparaciones",
    description: "Espacio dedicado para productos en reparación y refurbishing",
    location: "Zona 1, Ciudad de Guatemala",
    status: "maintenance",
    manager_id: 3,
    recentMovements: [
      {
        product: "Laptop HP Pavilion",
        type: "entrada",
        quantity: 2,
        date: "2024-01-10",
      },
    ],
  },
];

export default function WarehousesPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Activa</Badge>;
      case "maintenance":
        return <Badge variant="secondary">Mantenimiento</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactiva</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case "entrada":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Entrada
          </Badge>
        );
      case "salida":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            Salida
          </Badge>
        );
      case "transferencia":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Transferencia
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  const { setTitle, setActions } = useSidebar();
  useEffect(() => {
    setTitle("Bodegas");
    const actions = [
      <Button variant="outline" asChild>
        <Link href="/app/warehouses/list">
          <List className="h-4 w-4 mr-2" />
          Ver Listado
        </Link>
      </Button>,
      <Button asChild>
        <Link href="/app/warehouses/movements/new">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Movimiento
        </Link>
      </Button>,
    ];
    setActions(actions);
    return () => {
      setTitle("");
      setActions([]);
    };
  }, []);
  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Estadísticas rápidas */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bodegas
              </CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sampleWarehouses.length}
              </div>
              <p className="text-xs text-muted-foreground">
                ubicaciones registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bodegas Activas
              </CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sampleWarehouses.filter((w) => w.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">en operación</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                En Mantenimiento
              </CardTitle>
              <Activity className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {
                  sampleWarehouses.filter((w) => w.status === "maintenance")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                requieren atención
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Movimientos Hoy
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                transacciones registradas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cards de bodegas */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {sampleWarehouses.map((warehouse) => (
            <Card key={warehouse.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">
                        {warehouse.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {warehouse.code}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(warehouse.status)}
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Descripción */}
                <div>
                  <h4 className="text-sm font-medium mb-1">Descripción</h4>
                  <p className="text-sm text-muted-foreground">
                    {warehouse.description}
                  </p>
                </div>

                {/* Ubicación */}
                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Ubicación
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {warehouse.location}
                  </p>
                </div>

                {/* Últimos movimientos */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Últimos Movimientos
                  </h4>
                  <div className="space-y-2">
                    {warehouse.recentMovements.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No hay movimientos recientes
                      </p>
                    ) : (
                      warehouse.recentMovements
                        .slice(0, 3)
                        .map((movement, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {movement.product}
                              </p>
                              <p className="text-muted-foreground">
                                {movement.quantity} unidades - {movement.date}
                              </p>
                            </div>
                            <div className="ml-2">
                              {getMovementTypeBadge(movement.type)}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <a href={`/warehouses/${warehouse.id}`}>Ver Detalles</a>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <a
                      href={`/warehouses/movements/new?warehouse=${warehouse.id}`}
                    >
                      Nuevo Movimiento
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarInset>
  );
}
