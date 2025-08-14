"use client";

import { use, useEffect, useState } from "react";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductDialog } from "@/components/products/product-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const [showDialog, setShowDialog] = useState(true);
  const router = useRouter();

  const handleSave = (productData: any) => {
    // Aquí guardarías el producto en la base de datos
    console.log("Nuevo producto:", productData);
    router.push("/app/products/list");
  };

  const handleCancel = () => {
    router.push("/app/products");
  };
  const { setTitle, setLinks } = useSidebar();

  useEffect(() => {
    setTitle("Nuevo Producto");
    setLinks([
      <Button key="volver" variant="ghost" size="sm" onClick={handleCancel}>
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>,
    ]);
    return () => {
      setTitle("");
      setLinks([]);
    };
  }, []);
  return (
    <SidebarInset>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Agregar Nuevo Producto</h2>
          <p className="text-muted-foreground mb-4">
            Complete el formulario para agregar un producto al inventario
          </p>
        </div>
      </div>

      <ProductDialog
        open={showDialog}
        onOpenChange={(open) => !open && handleCancel()}
        onSave={handleSave}
      />
    </SidebarInset>
  );
}
