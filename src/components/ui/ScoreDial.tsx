import { scoreColor } from "@/lib/format";
import { cn } from "@/lib/cn";

type ScoreDialProps = {
  score: number;
  outOf?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Big "88/100" display used on history cards and stat tiles. */
export function ScoreDial({ score, outOf = 100, label = "ATS SCORE", size = "md", className }: ScoreDialProps) {
  const color = scoreColor(score);
  const sizes = {
    sm: { num: "text-2xl", unit: "text-xs", label: "text-[10px]" },
    md: { num: "text-4xl", unit: "text-sm", label: "text-[10px]" },
    lg: { num: "text-6xl", unit: "text-base", label: "text-xs" },
  }[size];

  const colorClass =
    color === "green" ? "text-score-green" : color === "amber" ? "text-score-amber" : "text-score-red";

  return (
    <div className={cn("flex flex-col leading-none", className)}>
      <div className="flex items-baseline gap-1">
        <span className={cn("font-bold tracking-tight", sizes.num, colorClass)}>{score}</span>
        <span className={cn("text-text-muted", sizes.unit)}>/{outOf}</span>
      </div>
      {label && (
        <span className={cn("mt-1.5 uppercase tracking-widest text-text-muted", sizes.label)}>
          {label}
        </span>
      )}
    </div>
  );
}
