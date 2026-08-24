import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "cyan" | "green" | "amber" | "red" | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  /** Filled pill vs. soft pill vs. outline. */
  variant?: "soft" | "outline";
};

const TONES: Record<BadgeTone, { soft: string; outline: string }> = {
  cyan: {
    soft: "bg-accent/10 text-accent border border-accent/25",
    outline: "border border-accent/50 text-accent",
  },
  green: {
    soft: "bg-score-green/10 text-score-green border border-score-green/25",
    outline: "border border-score-green/50 text-score-green",
  },
  amber: {
    soft: "bg-score-amber/10 text-score-amber border border-score-amber/25",
    outline: "border border-score-amber/50 text-score-amber",
  },
  red: {
    soft: "bg-score-red/10 text-score-red border border-score-red/25",
    outline: "border border-score-red/50 text-score-red",
  },
  neutral: {
    soft: "bg-hover text-text-secondary border border-border-subtle",
    outline: "border border-border-subtle text-text-secondary",
  },
};

export function Badge({ tone = "neutral", variant = "soft", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium leading-none h-6",
        TONES[tone][variant],
        className,
      )}
      {...rest}
    />
  );
}
