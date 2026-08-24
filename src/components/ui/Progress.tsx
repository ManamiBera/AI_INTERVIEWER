import { scoreColor, clamp } from "@/lib/format";
import { cn } from "@/lib/cn";

type ProgressProps = {
  value: number; // 0-100
  className?: string;
  tone?: "cyan" | "auto";
};

export function Progress({ value, className, tone = "cyan" }: ProgressProps) {
  const v = clamp(value, 0, 100);
  const color = tone === "auto" ? scoreColor(v) : "cyan";
  const fillClass =
    color === "green"
      ? "bg-score-green"
      : color === "amber"
      ? "bg-score-amber"
      : color === "red"
      ? "bg-score-red"
      : "bg-cyan-gradient";
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-elevated overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", fillClass)}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
