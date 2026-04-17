import { useMemo } from "react";
import { useInventory } from "@/store/inventoryStore";
import { MODULES } from "@/data/inventory";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Boxes, Cpu, FlaskConical, Activity, Wrench, AlertTriangle, DollarSign, ShieldAlert, TrendingUp } from "lucide-react";
import { fmtCurrency, fmtNumber, fmtDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";

const CHART_COLORS = ["hsl(214 88% 38%)", "hsl(200 95% 55%)", "hsl(152 65% 40%)", "hsl(35 95% 52%)", "hsl(265 70% 55%)"];

export default function Dashboard() {
  const { items } = useInventory();

  const stats = useMemo(() => {
    const total = items.length;
    const lab = items.filter((i) => i.modulo === "laboratorio").length;
    const comp = items.filter((i) => i.modulo === "componentes").length;
    const enUso = items.filter((i) => i.estado === "En uso").length;
    const mant = items.filter((i) => i.estado === "Mantenimiento").length;
    const stockBajo = items.filter((i) => i.cantidad <= i.stockMinimo);
    const valorTotal = items.reduce((acc, i) => acc + i.costoUnitario * i.cantidad, 0);
    return { total, lab, comp, enUso, mant, stockBajo, valorTotal };
  }, [items]);

  const porModulo = useMemo(() =>
    MODULES.map((m) => ({
      name: m.label.split(" ")[0],
      cantidad: items.filter((i) => i.modulo === m.key).length,
      valor: items.filter((i) => i.modulo === m.key).reduce((a, i) => a + i.costoUnitario * i.cantidad, 0),
    })), [items]);

  const porEstado = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((i) => { counts[i.estado] = (counts[i.estado] ?? 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [items]);

  const porCategoria = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((i) => { counts[i.categoria] = (counts[i.categoria] ?? 0) + i.cantidad; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([name, qty]) => ({ name, qty }));
  }, [items]);

  const recientes = useMemo(() =>
    [...items].sort((a, b) => b.fechaActualizacion.localeCompare(a.fechaActualizacion)).slice(0, 5),
    [items]);

  const mantenimientos = useMemo(() =>
    items.filter((i) => i.proximoMantenimiento)
      .sort((a, b) => (a.proximoMantenimiento! < b.proximoMantenimiento! ? -1 : 1))
      .slice(0, 5),
    [items]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Panel de Control</p>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Dashboard <span className="text-gradient-primary">IoTing</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vista general del inventario tecnológico — Industria 4.0
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-soft">
          <span className="h-2 w-2 animate-pulse-glow rounded-full bg-success" />
          Sistema operativo · Actualizado hoy
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de activos" value={fmtNumber(stats.total)} icon={Boxes} tone="primary" hint={`${MODULES.length} módulos activos`} />
        <StatCard label="Equipos laboratorio" value={fmtNumber(stats.lab)} icon={FlaskConical} tone="info" />
        <StatCard label="Componentes electrónicos" value={fmtNumber(stats.comp)} icon={Cpu} tone="info" />
        <StatCard label="Valor total inventario" value={fmtCurrency(stats.valorTotal)} icon={DollarSign} tone="success" hint="Costo × cantidad" />
        <StatCard label="Equipos en uso" value={fmtNumber(stats.enUso)} icon={Activity} tone="info" />
        <StatCard label="En mantenimiento" value={fmtNumber(stats.mant)} icon={Wrench} tone="warning" />
        <StatCard label="Stock bajo" value={fmtNumber(stats.stockBajo.length)} icon={AlertTriangle} tone="destructive" hint="Bajo el mínimo" />
        <StatCard label="Crecimiento mensual" value="+12.4%" icon={TrendingUp} tone="success" trend={{ value: "vs mes anterior", positive: true }} />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 bg-gradient-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Inventario por módulo</h3>
              <p className="text-xs text-muted-foreground">Cantidad de registros y valor monetario</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porModulo} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(200 95% 55%)" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(214 88% 38%)" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 90%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(215 25% 90%)", borderRadius: 12, fontSize: 12, boxShadow: "0 8px 24px hsl(214 88% 38% / 0.12)" }}
                  cursor={{ fill: "hsl(210 100% 96%)" }}
                />
                <Bar dataKey="cantidad" fill="url(#gradPrimary)" radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
          <h3 className="font-display text-lg font-semibold">Estado de equipos</h3>
          <p className="mb-2 text-xs text-muted-foreground">Distribución actual</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porEstado} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {porEstado.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(215 25% 90%)", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 bg-gradient-card p-5 shadow-soft">
          <h3 className="font-display text-lg font-semibold">Top categorías por unidades</h3>
          <p className="mb-2 text-xs text-muted-foreground">Mayor cantidad acumulada</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={porCategoria} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(200 95% 55%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(214 88% 38%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 90%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(215 25% 90%)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="qty" stroke="hsl(214 88% 38%)" strokeWidth={2.5} fill="url(#gradArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-warning" />
            <h3 className="font-display text-lg font-semibold">Alertas activas</h3>
          </div>
          <div className="space-y-2.5">
            {stats.stockBajo.slice(0, 3).map((i) => (
              <div key={i.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-destructive">Stock bajo</span>
                  <span className="text-muted-foreground">{i.cantidad}/{i.stockMinimo}</span>
                </div>
                <div className="mt-1 truncate text-sm font-medium">{i.nombre}</div>
                <div className="text-xs text-muted-foreground">{i.codigo}</div>
              </div>
            ))}
            {mantenimientos.slice(0, 2).map((i) => (
              <div key={i.id} className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-warning">Mantenimiento</span>
                  <span className="text-muted-foreground">{fmtDate(i.proximoMantenimiento)}</span>
                </div>
                <div className="mt-1 truncate text-sm font-medium">{i.nombre}</div>
                <div className="text-xs text-muted-foreground">{i.codigo}</div>
              </div>
            ))}
            {stats.stockBajo.length === 0 && mantenimientos.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin alertas pendientes ✨</p>
            )}
          </div>
        </Card>
      </section>

      <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
        <h3 className="mb-4 font-display text-lg font-semibold">Actividad reciente</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-4 font-semibold">Código</th>
                <th className="pb-2 pr-4 font-semibold">Nombre</th>
                <th className="pb-2 pr-4 font-semibold">Categoría</th>
                <th className="pb-2 pr-4 font-semibold">Estado</th>
                <th className="pb-2 pr-4 font-semibold">Actualizado</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((i) => (
                <tr key={i.id} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                  <td className="py-3 pr-4 font-mono text-xs text-primary">{i.codigo}</td>
                  <td className="py-3 pr-4 font-medium">{i.nombre}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{i.categoria}</td>
                  <td className="py-3 pr-4"><StatusBadge estado={i.estado} /></td>
                  <td className="py-3 pr-4 text-muted-foreground">{fmtDate(i.fechaActualizacion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
