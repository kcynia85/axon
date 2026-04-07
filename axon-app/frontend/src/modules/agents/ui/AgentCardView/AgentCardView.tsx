import React from "react";
import { cn } from "@/shared/lib/utils";
import { Edit2, Trash2, UserCircle } from "lucide-react";
import { AgentCardViewProps } from "./AgentCardView.types";

export const AgentCardView = ({
  title,
  description,
  badgeLabel,
  tags = [],
  layout = "grid",
  visualArea,
  isDraft = false,
  colorName = "default",
  onEdit,
  onDelete,
  onClick,
  agentId,
  className,
}: AgentCardViewProps) => {
  const isGrid = layout === "grid";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer overflow-hidden transition-all duration-300",
        "border border-zinc-200 dark:border-zinc-800",
        "bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700",
        isGrid 
          ? "flex-col rounded-2xl h-[420px]" 
          : "flex-row rounded-xl h-32 items-center",
        isDraft && "border-dashed opacity-80 hover:opacity-100",
        className
      )}
    >
      {/* Visual Area */}
      <div className={cn(
        "relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 transition-colors",
        isGrid ? "h-56 w-full" : "h-full w-32 border-r border-zinc-200 dark:border-zinc-800"
      )}>
        {visualArea || (
          <div className="flex h-full w-full items-center justify-center">
            <UserCircle className={cn(
                "text-zinc-200 dark:text-zinc-800",
                isGrid ? "h-32 w-32" : "h-16 w-16"
            )} />
          </div>
        )}
        
        {isDraft && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-bold uppercase tracking-wider text-white">
            Draft
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={cn(
        "flex flex-1 flex-col p-5 justify-between",
        !isGrid && "pl-6 pr-20"
      )}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {badgeLabel && (
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {badgeLabel}
              </span>
            )}
          </div>
          <h3 className={cn(
            "font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1",
            isGrid ? "text-lg" : "text-base"
          )}>
            {title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {description}
          </p>
        </div>

        {isGrid && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-zinc-400 ml-1">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions (Floating) */}
      <div className={cn(
        "absolute flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        isGrid ? "top-4 right-4" : "right-4 top-1/2 -translate-y-1/2"
      )}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 rounded-lg bg-white/90 dark:bg-zinc-900/90 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          title="Edit"
        >
          <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(agentId);
          }}
          className="p-2 rounded-lg bg-white/90 dark:bg-zinc-900/90 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/50 group/del transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover/del:text-red-500 transition-colors" />
        </button>
      </div>
    </div>
  );
};
