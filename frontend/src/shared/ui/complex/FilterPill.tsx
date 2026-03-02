"use client";

import React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/ui/ui/DropdownMenu";
import { FilterGroup, ActiveFilter } from "@/shared/domain/filters";

interface FilterPillProps {
  readonly label: string;
  readonly group: FilterGroup | undefined;
  readonly activeFilters: readonly ActiveFilter[];
  readonly onToggle: (id: string) => void;
}

export const FilterPill: React.FC<FilterPillProps> = ({ label, group, activeFilters, onToggle }) => {
  if (!group) return null;

  const activeInGroup = activeFilters.filter(f => f.category === group.id);
  const isActive = activeInGroup.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
          isActive 
            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white shadow-lg" 
            : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
        )}>
          {label}
          {isActive && (
            <span className="flex items-center justify-center bg-yellow-400 text-black rounded-full min-w-[14px] h-3.5 px-1 text-[8px] font-black">
              {activeInGroup.length}
            </span>
          )}
          <ChevronDown size={10} className={cn("transition-transform opacity-60", isActive ? "text-white dark:text-black" : "text-zinc-400")} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 rounded-xl p-2 shadow-2xl z-50">
        {group.options.map((opt) => {
          const isChecked = activeFilters.some(f => f.id === opt.id);
          return (
            <DropdownMenuItem
              key={opt.id}
              onClick={(e) => {
                e.preventDefault();
                onToggle(opt.id);
              }}
              className="flex items-center gap-3 py-2 px-3 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-white/5 rounded-lg transition-colors group/item"
            >
              <div className={cn(
                "w-3.5 h-3.5 border border-zinc-600 rounded-sm flex items-center justify-center transition-all shrink-0",
                isChecked 
                  ? "bg-white border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                  : "group-hover/item:border-zinc-400"
              )}>
                {isChecked && <Check size={10} className="text-black stroke-[4]" />}
              </div>
              <span className={cn(
                "text-[11px] font-mono transition-colors truncate",
                isChecked ? "text-black dark:text-white font-bold" : "text-zinc-500 group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-300"
              )}>
                {opt.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
