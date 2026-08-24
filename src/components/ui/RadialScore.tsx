import { scoreColor, clamp } from "@/lib/format";
import { cn } from "@/lib/cn";

type RadialScoreProps = {
  value: number; // 0-100
  size?: number; // px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
};

/** Circular progress ring used on the Interview Readiness card and ATS Verdict hero. */
export function RadialScore({
  value,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  className,
}: RadialScoreProps) {
  const v = clamp(value, 0, 100);
  const color = scoreColor(v);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (v / 100) * circumference;

  const strokeVar =
    color === "green" ? "var(--score-green)" : color === "amber" ? "var(--score-amber)" : "var(--score-red)";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={strokeVar}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          fill="none"
          style={{ transition: "stroke-dasharray 0.6s ease-out", filter: "drop-shadow(0 0 6px rgba(34,211,238,0.35))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-text-primary leading-none">{v}%</span>
        {label && <span className="mt-1 text-[10px] uppercase tracking-widest text-text-muted">{label}</span>}
        {sublabel && <span className="mt-1 text-xs text-text-secondary">{sublabel}</span>}
      </div>
    </div>
  );
}
