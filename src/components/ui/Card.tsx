import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** "surface" = base card, "elevated" = slightly lighter, "glow" = accent-outlined. */
  variant?: "surface" | "elevated" | "glow";
  /** Add a subtle interactive hover. */
  interactive?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "surface", interactive, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        variant === "surface" && "card-surface",
        variant === "elevated" && "card-elevated",
        variant === "glow" && "card-surface glow-border",
        interactive &&
          "transition duration-200 hover:border-accent/40 hover:shadow-glow-sm cursor-pointer",
        className,
      )}
      {...rest}
    />
  );
});

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5 pb-3", className)} {...rest} />;
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold text-text-primary tracking-tight", className)}
      {...rest}
    />
  );
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm text-text-secondary", className)} {...rest} />;
}
