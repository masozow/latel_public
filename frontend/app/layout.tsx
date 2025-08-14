import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
// import { ErrorBoundaryWrapper } from "@/components/my-components/error-boundaries/ErrorBoundaryWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Inventario LATEL",
  description: "Sistema completo de gestión de inventario, ventas y compras",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <ErrorBoundaryWrapper> */}
          {/* Layout público (AuthLayout) */}
          {children}
          {/* </ErrorBoundaryWrapper> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
