"use client";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";

const CustomersPage = () => {
  const { setTitle } = useSidebar();
  useEffect(() => {
    setTitle("Clientes");
    return () => {
      setTitle("");
    };
  });
  return (
    <SidebarInset>
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Clientes</CardTitle>
            <CardDescription>Módulo en desarrollo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Este módulo estará disponible próximamente con funcionalidades
              completas para gestionar clientes.
            </p>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
};
export default CustomersPage;
