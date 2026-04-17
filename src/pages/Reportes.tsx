import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/store/inventoryStore";
import { MODULES } from "@/data/inventory";
import { exportToExcel, exportToPDF } from "@/lib/exporters";
import { fmtCurrency, fmtNumber } from "@/lib/format";
import { FileSpreadsheet, FileText, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["hsl(214 88% 38%)", "hsl(200 95% 55%)", "hsl(152 65% 40%)", "hsl(35 95% 52%)", "hsl(265 70% 55%)"];

export default function Reportes() {
  const { items } = useInventory();

  const valorPorModulo = useMemo(() =>
    MODULES.map((m) => ({
      name: m.label,
      valor: items.filter((i) => i.modulo === m.key).reduce((a, i) => a + i.costoUnitario * i.cantidad, 0),
    })), [items]);

  const valorPorEstado = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((i) => { map[i.estado] = (map[i.estado] ?? 0) + i.costoUnitario * i.cantidad; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [items]);

  const total = items.reduce((a, i) => a + i.costoUnitario * i.cantidad, 0);

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Análisis</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Valor consolidado: <span className="font-semibold text-foreground">{fmtCurrency(total)}</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToExcel(items, "reporte-inventario.xlsx")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
          <Button size="sm" className="bg-gradient-primary" onClick={() => exportToPDF(items, "reporte-inventario.pdf")}>
            <FileText className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Valor por módulo</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valorPorModulo} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 90%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }} width={140} />
                <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(215 25% 90%)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="valor" fill="hsl(214 88% 38%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
          <h3 className="mb-4 font-display text-lg font-semibold">Valor por estado</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={valorPorEstado} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110}>
                  {valorPorEstado.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(215 25% 90%)", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
        <h3 className="mb-2 font-display text-lg font-semibold">Resumen ejecutivo</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Resumen label="Total registros" value={fmtNumber(items.length)} />
          <Resumen label="Unidades totales" value={fmtNumber(items.reduce((a, i) => a + i.cantidad, 0))} />
          <Resumen label="Valor total" value={fmtCurrency(total)} />
          <Resumen label="Costo promedio" value={fmtCurrency(total / Math.max(1, items.reduce((a, i) => a + i.cantidad, 0)))} />
        </div>
      </Card>
    </div>
  );
}

const Resumen = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-background/60 p-4">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-1 font-display text-xl font-bold text-gradient-primary">{value}</p>
  </div>
);
