import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
// import { ErrorBoundaryWrapper } from "@/components/my-components/error-boundaries/ErrorBoundaryWrapper";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    // <ErrorBoundaryWrapper>
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 overflow-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
    // </ErrorBoundaryWrapper>
  );
}
