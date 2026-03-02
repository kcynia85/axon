'use client';

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ActiveFilter } from "@/shared/domain/filters";

type FilterBarProps = {
  readonly activeFilters: readonly ActiveFilter[];
  readonly onRemove: (filterId: string) => void;
  readonly onClearAll: () => void;
  readonly className?: string;
}

/**
 * FilterBar - Pattern 1 Implementation
 * Reusable horizontal active filters bar with "Clear all" action.
 */
export const FilterBar = ({ 
  activeFilters, 
  onRemove, 
  onClearAll, 
  className 
}: FilterBarProps) => {
  if (activeFilters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onRemove(filter.id)}
            className={cn(
              "group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold transition-all",
              "bg-yellow-400 text-black hover:bg-yellow-500",
              "dark:bg-yellow-500 dark:hover:bg-yellow-400 shadow-sm"
            )}
          >
            {filter.label}
            <X 
              size={14} 
              className="text-black/50 group-hover:text-black transition-colors" 
              strokeWidth={3}
            />
          </button>
        ))}
      </div>

      <button
        onClick={onClearAll}
        className={cn(
          "ml-2 px-2 py-1 text-xs font-bold transition-all duration-200 rounded-md",
          "text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100",
          "hover:bg-zinc-100 dark:hover:bg-zinc-900",
          "active:scale-95 active:bg-zinc-200 dark:active:bg-zinc-800",
          "underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-800 hover:decoration-zinc-400 dark:hover:decoration-zinc-600"
        )}
      >
        Wyczyść wszystko
      </button>
    </div>
  );
};
