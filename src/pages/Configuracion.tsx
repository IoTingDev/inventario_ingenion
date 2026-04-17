import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Bell, Building2, Database } from "lucide-react";

export default function Configuracion() {
  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Sistema</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preferencias generales de la plataforma</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Empresa</h3>
          </div>
          <div className="space-y-3">
            <div><Label className="text-xs text-muted-foreground">Razón social</Label><Input defaultValue="IoTing Dev S.A. de C.V." /></div>
            <div><Label className="text-xs text-muted-foreground">Sector</Label><Input defaultValue="Industria 4.0 — IoT Industrial" /></div>
            <div><Label className="text-xs text-muted-foreground">Moneda</Label><Input defaultValue="MXN — Peso mexicano" /></div>
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Usuarios y roles</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 p-3">
              <div>
                <div className="font-medium">Andrea Salas</div>
                <div className="text-xs text-muted-foreground">andrea@ioting.dev</div>
              </div>
              <Badge className="bg-gradient-primary text-primary-foreground">Administrador</Badge>
            </div>
            <Button variant="outline" className="w-full">+ Invitar usuario</Button>
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Alertas</h3>
          </div>
          <div className="space-y-4">
            <Toggle label="Alertas de stock bajo" desc="Notificar cuando un componente baje del mínimo" defaultChecked />
            <Toggle label="Alertas de mantenimiento" desc="Recordar mantenimientos próximos a vencer" defaultChecked />
            <Toggle label="Reportes semanales" desc="Resumen ejecutivo cada lunes" />
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Datos</h3>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Los datos se almacenan localmente en el navegador (demo). Para sincronización en la nube y multi-usuario,
            activa <span className="font-semibold text-primary">Lovable Cloud</span>.
          </p>
          <Button variant="outline" onClick={() => { localStorage.removeItem("ioting:inventory:v1"); location.reload(); }}>
            Restaurar datos de ejemplo
          </Button>
        </Card>
      </div>
    </div>
  );
}

const Toggle = ({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
    <Switch defaultChecked={defaultChecked} />
  </div>
);
