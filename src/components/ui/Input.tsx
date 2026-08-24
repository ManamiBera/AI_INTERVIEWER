import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

const FIELD_BASE =
  "w-full bg-elevated/60 border border-border-subtle text-text-primary placeholder:text-text-muted " +
  "rounded-md transition-colors focus:border-accent/60 focus:bg-elevated focus:outline-none " +
  "disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(FIELD_BASE, "h-10 px-3 text-sm", className)}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(FIELD_BASE, "px-3 py-2.5 text-sm min-h-[120px] resize-y", className)}
        {...rest}
      />
    );
  },
);

export function Label({
  className,
  children,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs font-semibold uppercase tracking-wider text-text-muted", className)}
      {...rest}
    >
      {children}
    </label>
  );
}
