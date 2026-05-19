import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, style, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl px-3 py-2 text-sm transition-all duration-200 outline-none",
        "focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={{
        background: 'var(--input-bg)',
        color: 'var(--fg)',
        border: '1px solid var(--border)',
        ...style,
      }}
      {...props}
    />
  )
);
Input.displayName = "Input";
