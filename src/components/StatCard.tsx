import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "info" | "destructive";
  trend?: { value: string; positive?: boolean };
}

const tones: Record<NonNullable<Props["tone"]>, string> = {
  primary: "from-primary to-primary-glow text-primary-foreground",
  success: "from-success to-success/70 text-success-foreground",
  warning: "from-warning to-warning/70 text-warning-foreground",
  info: "from-info to-info/70 text-info-foreground",
  destructive: "from-destructive to-destructive/70 text-destructive-foreground",
};

export const StatCard = ({ label, value, icon: Icon, hint, tone = "primary", trend }: Props) => (
  <Card className="group relative overflow-hidden border-border/60 bg-gradient-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className={cn("rounded-xl bg-gradient-to-br p-2.5 shadow-md", tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    {trend && (
      <div className={cn("mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        trend.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
        {trend.positive ? "▲" : "▼"} {trend.value}
      </div>
    )}
    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
  </Card>
);
