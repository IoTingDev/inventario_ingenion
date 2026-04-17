import { LayoutDashboard, Boxes, FileBarChart, Settings, Cpu, Wrench, Server, Rocket, FlaskConical } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "@/assets/ioting-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const principal = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventario", url: "/inventario", icon: Boxes },
  { title: "Reportes", url: "/reportes", icon: FileBarChart },
  { title: "Configuración", url: "/configuracion", icon: Settings },
];

const modulos = [
  { title: "Laboratorio", url: "/inventario?m=laboratorio", icon: FlaskConical },
  { title: "Componentes", url: "/inventario?m=componentes", icon: Cpu },
  { title: "Herramientas", url: "/inventario?m=herramientas", icon: Wrench },
  { title: "Activos TI", url: "/inventario?m=activos", icon: Server },
  { title: "Proyectos", url: "/inventario?m=proyectos", icon: Rocket },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (url: string) => {
    const [path, query] = url.split("?");
    if (location.pathname !== path) return false;
    if (!query) return location.search === "" || (path === "/inventario" && !location.search.includes("m="));
    return location.search.includes(query);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/60 px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/95 p-1 shadow-soft">
            <img src={logo} alt="IoTing" className="h-full w-full object-contain" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-base font-bold text-sidebar-primary-foreground/95">IoTing</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/70">Industria 4.0</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/60">Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {principal.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/60">Módulos</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {modulos.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 px-3 py-3">
        {!collapsed && (
          <div className="text-[10px] leading-relaxed text-sidebar-foreground/60">
            <div className="font-medium text-sidebar-foreground/80">IoTing Dev © 2025</div>
            Plataforma de inventario v1.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
