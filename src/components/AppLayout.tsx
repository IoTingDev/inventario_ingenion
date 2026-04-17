import { ReactNode } from "react";
import { Bell, Search, UserCircle2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-subtle">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md">
            <SidebarTrigger className="text-foreground" />
            <div className="relative hidden flex-1 max-w-md md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar código, nombre, modelo, proyecto…"
                className="h-9 border-border/80 bg-muted/40 pl-9 text-sm focus-visible:bg-background"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive animate-pulse-glow" />
              </Button>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 pr-3">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-primary text-primary-foreground">
                  <UserCircle2 className="h-4 w-4" />
                </div>
                <div className="hidden text-right leading-tight sm:block">
                  <div className="text-xs font-semibold">Andrea Salas</div>
                  <div className="text-[10px] text-muted-foreground">Administrador</div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 animate-fade-in p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
