import React from "react";
import { Badge } from "@/shared/ui/ui/Badge";
import { cn } from "@/lib/utils";
import { Circle, Clock, CheckCircle2, AlertCircle, Sparkles, Send } from "lucide-react";

export type StatusVariant = "default" | "success" | "warning" | "error" | "info" | "pending" | "new" | "review";

interface StatusBadgeProps {
  readonly status: string;
  readonly variant?: StatusVariant;
  readonly showIcon?: boolean;
  readonly className?: string;
}

const statusConfig: Record<StatusVariant, { color: string; icon: React.FC<any> }> = {
  default: { color: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700", icon: Circle },
  success: { color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", icon: CheckCircle2 },
  warning: { color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", icon: Clock },
  error: { color: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20", icon: AlertCircle },
  info: { color: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border-sky-200 dark:border-sky-500/20", icon: Circle },
  pending: { color: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 animate-pulse", icon: Clock },
  new: { color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", icon: Sparkles },
  review: { color: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20", icon: Send },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = "default", 
  showIcon = true,
  className 
}) => {
  const config = statusConfig[variant] || statusConfig.default;
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "px-2 py-0.5 font-bold uppercase tracking-widest text-[9px] gap-1.5 border transition-all",
        config.color,
        className
      )}
    >
      {showIcon && <Icon size={10} className="shrink-0" />}
      {status}
    </Badge>
  );
};
