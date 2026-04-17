import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInventory } from "@/store/inventoryStore";
import { InventoryItem, MODULES, ModuleKey, EstadoItem } from "@/data/inventory";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Pencil, Trash2, FileSpreadsheet, FileText, Package, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { ItemFormDialog } from "@/components/ItemFormDialog";
import { fmtCurrency, fmtDate } from "@/lib/format";
import { exportToExcel, exportToPDF } from "@/lib/exporters";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ESTADOS: EstadoItem[] = ["Disponible", "En uso", "Mantenimiento", "Dañado"];

export default function Inventario() {
  const { items, upsert, remove } = useInventory();
  const [params, setParams] = useSearchParams();

  const moduleParam = (params.get("m") as ModuleKey | null) ?? "all";
  const [estado, setEstado] = useState<string>("all");
  const [ubicacion, setUbicacion] = useState<string>("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const ubicaciones = useMemo(() => Array.from(new Set(items.map((i) => i.ubicacion))).sort(), [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (moduleParam !== "all" && i.modulo !== moduleParam) return false;
      if (estado !== "all" && i.estado !== estado) return false;
      if (ubicacion !== "all" && i.ubicacion !== ubicacion) return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        const blob = `${i.codigo} ${i.nombre} ${i.marca} ${i.modelo} ${i.categoria} ${i.subcategoria} ${i.responsable} ${i.proyectoAsignado ?? ""} ${i.etiquetas.join(" ")}`.toLowerCase();
        if (!blob.includes(s)) return false;
      }
      return true;
    });
  }, [items, moduleParam, estado, ubicacion, q]);

  const setModule = (key: string) => {
    const p = new URLSearchParams(params);
    if (key === "all") p.delete("m"); else p.set("m", key);
    setParams(p);
  };

  const handleNew = () => { setEditing(null); setDialogOpen(true); };
  const handleEdit = (i: InventoryItem) => { setEditing(i); setDialogOpen(true); };
  const handleSave = (i: InventoryItem) => {
    upsert(i);
    toast({ title: editing ? "Registro actualizado" : "Registro creado", description: `${i.codigo} — ${i.nombre}` });
  };
  const handleDelete = (i: InventoryItem) => {
    remove(i.id);
    toast({ title: "Registro eliminado", description: `${i.codigo} — ${i.nombre}` });
  };

  const stockBajo = filtered.filter((i) => i.cantidad <= i.stockMinimo).length;

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Gestión</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} registros · {stockBajo > 0 && <span className="text-destructive">{stockBajo} con stock bajo</span>}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToExcel(filtered)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToPDF(filtered)}>
            <FileText className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button size="sm" className="bg-gradient-primary" onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo registro
          </Button>
        </div>
      </header>

      <Card className="border-border/60 bg-card p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por código, nombre, marca…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
          </div>
          <div className="md:col-span-3">
            <Select value={moduleParam} onValueChange={setModule}>
              <SelectTrigger><SelectValue placeholder="Módulo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los módulos</SelectItem>
                {MODULES.map((m) => <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {ESTADOS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Select value={ubicacion} onValueChange={setUbicacion}>
              <SelectTrigger><SelectValue placeholder="Ubicación" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ubicaciones</SelectItem>
                {ubicaciones.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-border/60 bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Activo</th>
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 font-semibold text-right">Cant.</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Ubicación</th>
                <th className="px-4 py-3 font-semibold">Responsable</th>
                <th className="px-4 py-3 font-semibold text-right">Costo total</th>
                <th className="px-4 py-3 font-semibold">Actualizado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const low = i.cantidad <= i.stockMinimo;
                return (
                  <tr key={i.id} className="border-t border-border/60 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary-soft text-primary">
                          {i.imagen ? <img src={i.imagen} alt="" className="h-full w-full object-cover" /> : <Package className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{i.nombre}</div>
                          <div className="truncate text-xs text-muted-foreground">{i.marca} · {i.modelo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">{i.codigo}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{i.categoria}</div>
                      <div className="text-xs text-muted-foreground">{i.subcategoria}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className={`font-semibold ${low ? "text-destructive" : ""}`}>{i.cantidad}</div>
                      <div className="text-[10px] text-muted-foreground">mín. {i.stockMinimo}</div>
                      {low && <Badge variant="outline" className="mt-1 border-destructive/30 bg-destructive/10 text-[9px] text-destructive"><AlertTriangle className="mr-1 h-2.5 w-2.5" />Bajo</Badge>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge estado={i.estado} /></td>
                    <td className="px-4 py-3 text-xs">{i.ubicacion}</td>
                    <td className="px-4 py-3 text-xs">{i.responsable}</td>
                    <td className="px-4 py-3 text-right font-medium">{fmtCurrency(i.costoUnitario * i.cantidad)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(i.fechaActualizacion)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(i)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Se eliminará "{i.codigo} — {i.nombre}" del inventario. Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(i)} className="bg-destructive text-destructive-foreground">Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-muted-foreground">
                    <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
                    No se encontraron registros con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ItemFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={editing} onSave={handleSave} />
    </div>
  );
}
