import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { LucideIcon, Sparkles } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon = Sparkles, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 rounded-lg",
        "border border-dashed border-border-subtle bg-surface/40",
        className,
      )}
    >
      <div className="h-14 w-14 rounded-full grid place-items-center bg-accent/10 border border-accent/20 mb-4">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-text-secondary max-w-md">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
