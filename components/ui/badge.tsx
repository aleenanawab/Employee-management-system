import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const variantMap = {
  default: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  secondary: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  destructive: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  outline: "border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variantMap[variant], className)}>
      {children}
    </span>
  );
}
