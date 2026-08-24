import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type StatTileProps = {
  label: string;
  value: string | number;
  delta?: string; // e.g. "+8% this week"
  icon: LucideIcon;
  tone?: "cyan" | "green" | "amber";
};

const TONE: Record<string, string> = {
  cyan: "text-accent bg-accent/10 border-accent/25",
  green: "text-score-green bg-score-green/10 border-score-green/25",
  amber: "text-score-amber bg-score-amber/10 border-score-amber/25",
};

export function StatTile({ label, value, delta, icon: Icon, tone = "cyan" }: StatTileProps) {
  return (
    <Card className="p-5 flex items-start gap-4">
      <div
        className={cn(
          "h-10 w-10 rounded-md grid place-items-center border shrink-0",
          TONE[tone],
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">
          {label}
        </div>
        <div className="mt-1 text-2xl font-bold text-text-primary leading-none">{value}</div>
        {delta && <div className="mt-1.5 text-xs text-score-green">{delta}</div>}
      </div>
    </Card>
  );
}
