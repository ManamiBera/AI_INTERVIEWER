import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  eyebrow?: string;
  className?: string;
};

/** Shared page header used across every route to keep typographic rhythm consistent. */
export function PageHeader({ title, subtitle, actions, eyebrow, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-6 mb-8 animate-fade-in", className)}>
      <div>
        {eyebrow && (
          <div className="mb-2 text-[11px] uppercase tracking-widest text-accent/80 font-semibold">
            {eyebrow}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-cyan leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm md:text-base text-text-secondary max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}
