"use client";

import { useState, useEffect } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Search, Filter, ArrowLeft } from "lucide-react";
import { ProductDialog } from "@/components/products/product-dialog";
import { ProductsTable } from "@/components/products/products-table";
import type { Product } from "@/types/database";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

// Datos de ejemplo
const sampleProducts: Product[] = [
  {
    id: 1,
    code: "LAP001",
    name: "Laptop Dell XPS 13",
    description: "Laptop ultrabook 13 pulgadas, Intel i7, 16GB RAM, 512GB SSD",
    category_id: 1,
    brand_id: 1,
    unit_price: 1299.99,
    cost_price: 999.99,
    stock_quantity: 15,
    min_stock: 5,
    max_stock: 50,
    barcode: "1234567890123",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    code: "MOU001",
    name: "Mouse Logitech MX Master 3",
    description: "Mouse inalámbrico ergonómico para productividad",
    category_id: 2,
    brand_id: 2,
    unit_price: 99.99,
    cost_price: 69.99,
    stock_quantity: 25,
    min_stock: 10,
    max_stock: 100,
    barcode: "1234567890124",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    code: "KEY001",
    name: "Teclado Mecánico RGB",
    description: "Teclado mecánico gaming con iluminación RGB",
    category_id: 2,
    brand_id: 3,
    unit_price: 149.99,
    cost_price: 99.99,
    stock_quantity: 3,
    min_stock: 8,
    max_stock: 40,
    barcode: "1234567890125",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { setLinks, setActions, setTitle, setDescription } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setTitle("Listado de Productos");
    setDescription("Gestiona tu inventario de productos");
    setLinks([
      <Button
        key="volver"
        variant="ghost"
        size="sm"
        onClick={() => {
          const parentPath = pathname.split("/").slice(0, -1).join("/") || "/";
          router.push(parentPath);
        }}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>,
    ]);
    setActions([
      <Button key="nuevo" onClick={handleAddProduct} className="flex">
        <Plus className="h-4 w-4 md:mr-2" />
        <span className="hidden md:block">Nuevo Producto</span>
      </Button>,
    ]);
    return () => {
      setTitle("");
      setDescription("");
      setLinks([]);
      setActions([]);
    };
  }, [pathname]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowDialog(true);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...productData, updated_at: new Date() }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        created_at: new Date(),
        updated_at: new Date(),
        active: true,
        ...productData,
      } as Product;
      setProducts([...products, newProduct]);
    }
    setShowDialog(false);
  };

  return (
    <SidebarInset>
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos por nombre, código o descripción..."
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

        <Card>
          <CardHeader>
            <CardTitle>Productos ({filteredProducts.length})</CardTitle>
            <CardDescription>
              Gestiona tu inventario de productos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ProductsTable
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </CardContent>
        </Card>
      </div>

      <ProductDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </SidebarInset>
  );
}
