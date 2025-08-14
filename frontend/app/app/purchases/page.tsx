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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Truck,
  DollarSign,
  Package,
  Clock,
} from "lucide-react";
import { PurchaseDialog } from "@/components/purchases/purchase-dialog";
import { PurchasesTable } from "@/components/purchases/purchases-table";
import type { Purchase } from "@/types/database";

// Datos de ejemplo
const samplePurchases: Purchase[] = [
  {
    id: 1,
    invoice_number: "PUR-001",
    supplier_id: 1,
    user_id: 1,
    purchase_date: new Date("2024-01-15"),
    subtotal: 5000.0,
    tax_amount: 800.0,
    total_amount: 5800.0,
    status: "received",
    notes: "Compra de laptops para inventario",
  },
  {
    id: 2,
    invoice_number: "PUR-002",
    supplier_id: 2,
    user_id: 1,
    purchase_date: new Date("2024-01-20"),
    subtotal: 1200.0,
    tax_amount: 192.0,
    total_amount: 1392.0,
    status: "pending",
    notes: "Accesorios de oficina",
  },
  {
    id: 3,
    invoice_number: "PUR-003",
    supplier_id: 1,
    user_id: 1,
    purchase_date: new Date("2024-01-25"),
    subtotal: 3500.0,
    tax_amount: 560.0,
    total_amount: 4060.0,
    status: "received",
    notes: "Equipos de cómputo",
  },
];

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>(samplePurchases);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.invoice_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      purchase.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingPurchases = purchases.filter(
    (purchase) => purchase.status === "pending"
  );
  const totalPurchases = purchases.reduce(
    (sum, purchase) => sum + purchase.total_amount,
    0
  );
  const monthlyPurchases = purchases
    .filter((purchase) => {
      const purchaseMonth = purchase.purchase_date.getMonth();
      const currentMonth = new Date().getMonth();
      return purchaseMonth === currentMonth;
    })
    .reduce((sum, purchase) => sum + purchase.total_amount, 0);

  const handleAddPurchase = () => {
    setEditingPurchase(null);
    setShowDialog(true);
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setShowDialog(true);
  };

  const handleDeletePurchase = (purchaseId: number) => {
    setPurchases(purchases.filter((p) => p.id !== purchaseId));
  };

  const handleSavePurchase = (purchaseData: Partial<Purchase>) => {
    if (editingPurchase) {
      // Editar compra existente
      setPurchases(
        purchases.map((p) =>
          p.id === editingPurchase.id ? { ...p, ...purchaseData } : p
        )
      );
    } else {
      // Agregar nueva compra
      const newPurchase: Purchase = {
        id: Math.max(...purchases.map((p) => p.id)) + 1,
        purchase_date: new Date(),
        ...purchaseData,
      } as Purchase;
      setPurchases([...purchases, newPurchase]);
    }
    setShowDialog(false);
  };
  const { setTitle, setActions } = useSidebar();

  useEffect(() => {
    setTitle("Compras");
    setActions([
      <Button key="nuevo" onClick={handleAddPurchase} className="flex">
        <Plus className="h-4 w-4" />
        Nueva Compra
      </Button>,
    ]);
    return () => {
      setTitle("");
      setActions([]);
    };
  }, []);
  return (
    <SidebarInset>
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        {/* Estadísticas rápidas */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Compras
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
              <p className="text-xs text-muted-foreground">
                órdenes registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingPurchases.length}
              </div>
              <p className="text-xs text-muted-foreground">por recibir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invertido
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalPurchases.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">inversión total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${monthlyPurchases.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">compras del mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas de compras pendientes */}
        {pendingPurchases.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Clock className="h-5 w-5" />
                Compras Pendientes de Recibir
              </CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                Las siguientes compras están pendientes de recepción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {pendingPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {purchase.invoice_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${purchase.total_amount.toFixed(2)} -{" "}
                        {purchase.purchase_date.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      Pendiente
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros y búsqueda */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar compras por número de factura o notas..."
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

        {/* Tabla de compras */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Compras</CardTitle>
            <CardDescription>
              Gestiona tus órdenes de compra y recepciones
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <PurchasesTable
              purchases={filteredPurchases}
              onEdit={handleEditPurchase}
              onDelete={handleDeletePurchase}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialog para agregar/editar compra */}
      <PurchaseDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        purchase={editingPurchase}
        onSave={handleSavePurchase}
      />
    </SidebarInset>
  );
}
