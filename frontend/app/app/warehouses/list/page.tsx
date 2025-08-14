"use client";

import { useEffect, useState } from "react";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const sampleWarehouses = [
  {
    id: 1,
    code: "BOD001",
    name: "Bodega Principal",
    description: "Bodega central para productos de alta rotación",
    location: "15 avenida 5-55 Zona 10, Ciudad de Guatemala",
    status: "active",
    manager_id: 1,
  },
  {
    id: 2,
    code: "BOD002",
    name: "Bodega Secundaria",
    description: "Almacén para productos de baja rotación y stock de reserva",
    location: "Zona 12, Ciudad de Guatemala",
    status: "active",
    manager_id: 2,
  },
  {
    id: 3,
    code: "BOD003",
    name: "Bodega de Reparaciones",
    description: "Espacio dedicado para productos en reparación y refurbishing",
    location: "Zona 1, Ciudad de Guatemala",
    status: "maintenance",
    manager_id: 3,
  },
];

export default function WarehousesListPage() {
  const [warehouses, setWarehouses] = useState(sampleWarehouses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    warehouse: any;
    newStatus: string;
  } | null>(null);

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const badgeVariant =
      status === "active"
        ? "default"
        : status === "maintenance"
        ? "secondary"
        : status === "inactive"
        ? "destructive"
        : "outline";

    return (
      <Badge variant={badgeVariant} className="min-w-full">
        {getStatusLabel(status)}
      </Badge>
    );
  };

  const handleStatusChange = (warehouse: any, newStatus: string) => {
    setStatusChangeDialog({ warehouse, newStatus });
  };

  const confirmStatusChange = () => {
    if (statusChangeDialog) {
      setWarehouses(
        warehouses.map((w) =>
          w.id === statusChangeDialog.warehouse.id
            ? { ...w, status: statusChangeDialog.newStatus }
            : w
        )
      );
      setStatusChangeDialog(null);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activa";
      case "maintenance":
        return "Mantenimiento";
      case "inactive":
        return "Inactiva";
      default:
        return status;
    }
  };
  const { setTitle, setLinks } = useSidebar();

  useEffect(() => {
    setTitle("Listado de Bodegas");
    setLinks([
      <Button asChild variant="ghost" size="sm">
        <Link href="/app/warehouses">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </Button>,
    ]);
    return () => {
      setTitle("");
      setLinks([]);
    };
  }, []);
  return (
    <SidebarInset>
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        {/* Filtros y búsqueda */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar bodegas por nombre, código o ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-shrink-0 bg-transparent"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de bodegas */}
        <Card>
          <CardHeader>
            <CardTitle>Bodegas ({filteredWarehouses.length})</CardTitle>
            <CardDescription>
              Gestiona las ubicaciones de almacenamiento
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead className="text-left">Estado</TableHead>
                    <TableHead className="w-[4rem] text-center">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No se encontraron bodegas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWarehouses.map((warehouse) => (
                      <TableRow
                        key={warehouse.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-mono text-sm">
                          <Badge variant="outline">#{warehouse.id}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-left">
                          <Badge variant="outline">{warehouse.code}</Badge>
                        </TableCell>
                        <TableCell>{warehouse.name}</TableCell>
                        <TableCell className="break-words whitespace-normal">
                          {warehouse.description}
                        </TableCell>
                        <TableCell className="break-words whitespace-normal">
                          {warehouse.location}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild className="min-w-full">
                              <Button
                                variant="ghost"
                                className="h-8 min-w-full"
                              >
                                {getStatusBadge(warehouse.status)}
                                <ChevronDown className="h-3 w-3 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(warehouse, "active")
                                }
                                disabled={warehouse.status === "active"}
                              >
                                Activa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(warehouse, "maintenance")
                                }
                                disabled={warehouse.status === "maintenance"}
                              >
                                Mantenimiento
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(warehouse, "inactive")
                                }
                                disabled={warehouse.status === "inactive"}
                              >
                                Inactiva
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmación de cambio de estado */}
      <Dialog
        open={!!statusChangeDialog}
        onOpenChange={() => setStatusChangeDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cambiar el estado de la bodega{" "}
              <strong>{statusChangeDialog?.warehouse?.name}</strong> a{" "}
              <strong>
                {statusChangeDialog
                  ? getStatusLabel(statusChangeDialog.newStatus)
                  : ""}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusChangeDialog(null)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmStatusChange}>Confirmar Cambio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
}
