import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "destructive";
  size?: "default" | "icon" | "sm";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", style, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const sizes = {
      default: "px-4 py-2 text-sm h-10",
      sm:      "px-3 py-1.5 text-xs h-7",
      icon:    "h-9 w-9 p-0",
    };

    const variants: Record<string, React.CSSProperties> = {
      default:     { background: 'linear-gradient(135deg, #6d28d9, #059669)', color: '#fff', boxShadow: '0 2px 8px rgba(109,40,217,0.25)' },
      ghost:       { background: 'transparent', color: 'var(--fg-muted)' },
      outline:     { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border)' },
      destructive: { background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff' },
    };

    const hoverClass = {
      default:     "hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-px active:translate-y-0",
      ghost:       "hover:bg-[var(--primary-light)] hover:text-[var(--primary-text)]",
      outline:     "hover:border-[var(--neon-purple)] hover:text-[var(--primary-text)] hover:shadow-[0_0_12px_rgba(109,40,217,0.15)]",
      destructive: "hover:opacity-90 hover:-translate-y-px",
    };

    return (
      <button
        ref={ref}
        className={cn(base, sizes[size], hoverClass[variant], className)}
        style={{ ...variants[variant], ...style }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
