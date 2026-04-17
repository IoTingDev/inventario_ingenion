import { Badge } from "@/components/ui/badge";
import { EstadoItem } from "@/data/inventory";
import { cn } from "@/lib/utils";

const styles: Record<EstadoItem, string> = {
  "Disponible": "bg-success/15 text-success border-success/30 hover:bg-success/15",
  "En uso": "bg-info/15 text-info border-info/30 hover:bg-info/15",
  "Mantenimiento": "bg-warning/15 text-warning border-warning/40 hover:bg-warning/15",
  "Dañado": "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/15",
};

export const StatusBadge = ({ estado }: { estado: EstadoItem }) => (
  <Badge variant="outline" className={cn("font-medium", styles[estado])}>
    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
    {estado}
  </Badge>
);
