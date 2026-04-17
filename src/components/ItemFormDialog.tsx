import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryItem, MODULES, ModuleKey, EstadoItem } from "@/data/inventory";
import { ImagePlus } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: InventoryItem | null;
  onSave: (item: InventoryItem) => void;
}

const empty = (): InventoryItem => ({
  id: crypto.randomUUID(),
  codigo: "",
  modulo: "componentes",
  nombre: "",
  categoria: "",
  subcategoria: "",
  descripcion: "",
  marca: "",
  modelo: "",
  numeroSerie: "",
  especificaciones: "",
  voltaje: "",
  potencia: "",
  comunicacion: "",
  compatibilidad: "",
  proveedor: "",
  fechaCompra: new Date().toISOString().slice(0, 10),
  costoUnitario: 0,
  cantidad: 1,
  stockMinimo: 1,
  ubicacion: "",
  responsable: "",
  estado: "Disponible",
  proyectoAsignado: "",
  areaAsignada: "",
  fechaIngreso: new Date().toISOString().slice(0, 10),
  fechaActualizacion: new Date().toISOString().slice(0, 10),
  observaciones: "",
  etiquetas: [],
});

export const ItemFormDialog = ({ open, onOpenChange, initial, onSave }: Props) => {
  const [data, setData] = useState<InventoryItem>(empty());
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (open) {
      const base = initial ?? empty();
      setData(base);
      setTagsInput(base.etiquetas.join(", "));
    }
  }, [open, initial]);

  const set = <K extends keyof InventoryItem>(k: K, v: InventoryItem[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const moduloDef = MODULES.find((m) => m.key === data.modulo);

  const handleImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("imagen", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onSave({
      ...data,
      etiquetas: tagsInput.split(",").map((s) => s.trim()).filter(Boolean),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {initial ? "Editar registro" : "Nuevo registro"}
          </DialogTitle>
          <DialogDescription>Complete los campos del activo o componente.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <Section title="Información general">
            <Field label="Código *">
              <Input value={data.codigo} onChange={(e) => set("codigo", e.target.value)} placeholder="LAB-OSC-001" />
            </Field>
            <Field label="Módulo *">
              <Select value={data.modulo} onValueChange={(v) => set("modulo", v as ModuleKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MODULES.map((m) => <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Nombre *" wide>
              <Input value={data.nombre} onChange={(e) => set("nombre", e.target.value)} />
            </Field>
            <Field label="Categoría">
              <Select value={data.categoria || undefined} onValueChange={(v) => set("categoria", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  {moduloDef?.categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Subcategoría">
              <Input value={data.subcategoria} onChange={(e) => set("subcategoria", e.target.value)} />
            </Field>
            <Field label="Descripción técnica" wide>
              <Textarea rows={2} value={data.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
            </Field>
            <Field label="Imagen del producto" wide>
              <div className="flex items-center gap-3">
                {data.imagen ? (
                  <img src={data.imagen} alt="" className="h-16 w-16 rounded-lg border border-border object-cover" />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} className="max-w-xs" />
              </div>
            </Field>
          </Section>

          <Section title="Información técnica">
            <Field label="Marca"><Input value={data.marca} onChange={(e) => set("marca", e.target.value)} /></Field>
            <Field label="Modelo"><Input value={data.modelo} onChange={(e) => set("modelo", e.target.value)} /></Field>
            <Field label="N° de serie"><Input value={data.numeroSerie} onChange={(e) => set("numeroSerie", e.target.value)} /></Field>
            <Field label="Voltaje"><Input value={data.voltaje} onChange={(e) => set("voltaje", e.target.value)} placeholder="3.3V / 110VAC" /></Field>
            <Field label="Potencia"><Input value={data.potencia} onChange={(e) => set("potencia", e.target.value)} /></Field>
            <Field label="Comunicación"><Input value={data.comunicacion} onChange={(e) => set("comunicacion", e.target.value)} placeholder="I2C, SPI, UART" /></Field>
            <Field label="Compatibilidad" wide><Input value={data.compatibilidad} onChange={(e) => set("compatibilidad", e.target.value)} /></Field>
            <Field label="Especificaciones" wide>
              <Textarea rows={2} value={data.especificaciones} onChange={(e) => set("especificaciones", e.target.value)} />
            </Field>
          </Section>

          <Section title="Información administrativa">
            <Field label="Proveedor"><Input value={data.proveedor} onChange={(e) => set("proveedor", e.target.value)} /></Field>
            <Field label="Fecha de compra"><Input type="date" value={data.fechaCompra} onChange={(e) => set("fechaCompra", e.target.value)} /></Field>
            <Field label="Costo unitario"><Input type="number" value={data.costoUnitario} onChange={(e) => set("costoUnitario", +e.target.value)} /></Field>
            <Field label="Cantidad"><Input type="number" value={data.cantidad} onChange={(e) => set("cantidad", +e.target.value)} /></Field>
            <Field label="Stock mínimo"><Input type="number" value={data.stockMinimo} onChange={(e) => set("stockMinimo", +e.target.value)} /></Field>
            <Field label="Ubicación física"><Input value={data.ubicacion} onChange={(e) => set("ubicacion", e.target.value)} /></Field>
            <Field label="Responsable asignado"><Input value={data.responsable} onChange={(e) => set("responsable", e.target.value)} /></Field>
            <Field label="Estado">
              <Select value={data.estado} onValueChange={(v) => set("estado", v as EstadoItem)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Disponible", "En uso", "Mantenimiento", "Dañado"] as EstadoItem[]).map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </Section>

          <Section title="Información operativa">
            <Field label="Proyecto asignado"><Input value={data.proyectoAsignado} onChange={(e) => set("proyectoAsignado", e.target.value)} /></Field>
            <Field label="Área asignada"><Input value={data.areaAsignada} onChange={(e) => set("areaAsignada", e.target.value)} /></Field>
            <Field label="Fecha de ingreso"><Input type="date" value={data.fechaIngreso} onChange={(e) => set("fechaIngreso", e.target.value)} /></Field>
            <Field label="Próximo mantenimiento"><Input type="date" value={data.proximoMantenimiento ?? ""} onChange={(e) => set("proximoMantenimiento", e.target.value)} /></Field>
            <Field label="Etiquetas (separadas por coma)" wide>
              <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="iot, sensor, crítico" />
            </Field>
            <Field label="Observaciones" wide>
              <Textarea rows={2} value={data.observaciones} onChange={(e) => set("observaciones", e.target.value)} />
            </Field>
          </Section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!data.codigo || !data.nombre} className="bg-gradient-primary">
            {initial ? "Guardar cambios" : "Crear registro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-primary">{title}</h4>
    <div className="grid gap-3 md:grid-cols-2">{children}</div>
  </div>
);

const Field = ({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) => (
  <div className={wide ? "md:col-span-2" : ""}>
    <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
    {children}
  </div>
);
