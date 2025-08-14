"use client";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";

export default function SuppliersPage() {
  const { setTitle } = useSidebar();
  useEffect(() => {
    setTitle("Proveedores");
    return () => {
      setTitle("");
    };
  }, []);
  return (
    <SidebarInset>
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Proveedores</CardTitle>
            <CardDescription>Módulo en desarrollo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Este módulo estará disponible próximamente con funcionalidades
              completas para gestionar proveedores.
            </p>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
