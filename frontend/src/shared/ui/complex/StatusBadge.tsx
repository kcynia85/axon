import React from "react";
import { cn } from "@/shared/lib/utils";

export type StatusVariant = "default" | "success" | "warning" | "error" | "info";

interface StatusBadgeProps {
  readonly status: string;
  readonly variant?: StatusVariant;
  readonly className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700",
  success: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-800",
  warning: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800",
  error: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-100 dark:border-red-800",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = "default",
  className 
}) => {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
      variantStyles[variant],
      className
    )}>
      {status}
    </span>
  );
};
