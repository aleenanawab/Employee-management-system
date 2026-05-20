"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const DropdownContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { setOpen, open } = useContext(DropdownContext);
  const child = children as React.ReactElement<{ onClick?: () => void }>;
  if (asChild && child) return <child.type {...child.props} onClick={() => setOpen(!open)} />;
  return <button onClick={() => setOpen(!open)}>{children}</button>;
}

export function DropdownMenuContent({ children, align = "start", className, style }: { children: React.ReactNode; align?: "start" | "end"; className?: string; style?: React.CSSProperties }) {
  const { open } = useContext(DropdownContext);
  if (!open) return null;
  return (
    <div style={style} className={cn(
      "absolute z-50 mt-2 min-w-[160px] rounded-2xl border shadow-xl",
      "bg-white dark:bg-gray-900 dark:border-gray-700/60",
      "ring-1 ring-black/5 dark:ring-white/5",
      align === "end" ? "right-0" : "left-0",
      className
    )}>
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div style={style} className={cn("px-2 py-1.5 text-sm text-gray-900 dark:text-white", className)}>{children}</div>;
}

export function DropdownMenuSeparator({ style }: { style?: React.CSSProperties }) {
  return <div style={style} className="my-1 h-px bg-gray-100 dark:bg-gray-700/60" />;
}

export function DropdownMenuItem({ children, className, onClick, asChild, style }: { children: React.ReactNode; className?: string; onClick?: () => void; asChild?: boolean; style?: React.CSSProperties }) {
  const { setOpen } = useContext(DropdownContext);
  const base = cn(
    "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-gray-700 dark:text-gray-300",
    "hover:bg-gray-100 dark:hover:bg-white/8 transition-colors cursor-pointer",
    className
  );
  if (asChild) {
    const child = children as React.ReactElement<{ className?: string; onClick?: () => void }>;
    return <child.type {...child.props} className={cn(base, child.props.className)} onClick={() => { child.props.onClick?.(); setOpen(false); }} />;
  }
  return (
    <button style={style} onClick={() => { onClick?.(); setOpen(false); }} className={base}>
      {children}
    </button>
  );
}
