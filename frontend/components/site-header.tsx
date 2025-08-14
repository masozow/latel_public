"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "../components/theme/mode-toggle";

export const SiteHeader = () => {
  const { title, description, links, actions } = useSidebar();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4">
        <SidebarTrigger className="ml-1 fixed z-50 lg:static" />
        <Separator
          orientation="vertical"
          className="ml-10 lg:ml-1 data-[orientation=vertical]:h-16"
        />
        {links && (
          <div className="flex items-center justify-start gap-1">
            {links.map((link, index) => (
              <div key={index} className="flex items-center">
                {link}
                <Separator
                  orientation="vertical"
                  className="ml-10 lg:ml-1 data-[orientation=vertical]:h-16"
                />
              </div>
            ))}
          </div>
        )}
        <div className="ml-4 flex flex-col flex-1 items-start justify-center">
          <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground hidden sm:block">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center justify-end gap-2 mr-2">
            {actions.map((action, index) => (
              <div key={index} className="mx-0 px-0">
                {action}
              </div>
            ))}
          </div>
        )}

        <ModeToggle />
      </div>
    </header>
  );
};
