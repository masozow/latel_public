"use client";

import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CustomerForm,
  type CustomerFormData,
} from "@/components/customers/customer-form";
import { useEffect } from "react";

export default function NewCustomerPage() {
  const router = useRouter();

  const handleSaveCustomer = (data: CustomerFormData) => {
    // Aquí iría la lógica para guardar el nuevo cliente en tu base de datos
    console.log("Nuevo cliente guardado:", data);
    // Redirigir a la lista de clientes o a la página de detalles del nuevo cliente
    router.push("/customers"); // O a /customers/list si existe
  };

  const handleCancel = () => {
    router.back(); // Volver a la página anterior (ej. POS o lista de clientes)
  };
  const { setTitle, setLinks } = useSidebar();

  useEffect(() => {
    setTitle("Nuevo Cliente");
    setLinks([
      <Button asChild variant="ghost" size="sm" className="mr-2">
        <Link href="/app/customers">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Clientes
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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <CustomerForm onSave={handleSaveCustomer} onCancel={handleCancel} />
      </div>
    </SidebarInset>
  );
}
