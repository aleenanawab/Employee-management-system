import { cn } from "@/lib/utils";

export function Avatar({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}>{children}</div>;
}

export function AvatarFallback({ className, children, style }: { className?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center rounded-full text-sm font-medium", className)} style={style}>
      {children}
    </div>
  );
}
