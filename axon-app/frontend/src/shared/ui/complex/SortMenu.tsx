'use client';

import React, { forwardRef } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { SortOption } from "@/shared/domain/filters";
import { ArrowUpDown } from "lucide-react";

interface SortMenuProps {
  readonly options: readonly SortOption[];
  readonly activeOptionId: string;
  readonly onSelect: (optionId: string) => void;
  readonly trigger?: React.ReactNode;
}

/**
 * SortMenu - Pattern: Minimalist Sort Dropdown with Glassmorphism
 */
export const SortMenu = forwardRef<HTMLDivElement, SortMenuProps>(({
  options,
  activeOptionId,
  onSelect,
  trigger
}, ref) => {
  return (
    <DropdownMenuPrimitive.Root>
      {trigger ? (
        <DropdownMenuPrimitive.Trigger asChild>
          {trigger}
        </DropdownMenuPrimitive.Trigger>
      ) : (
        <DropdownMenuPrimitive.Trigger className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 group w-fit outline-none">
            <ArrowUpDown size={14} />
            Sort
        </DropdownMenuPrimitive.Trigger>
      )}
      
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content 
          ref={ref}
          sideOffset={12}
          align="start"
          className="z-[9999] min-w-[200px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="py-2">
            <div className="px-6 py-2 border-b border-zinc-100 dark:border-zinc-900 mb-1">
              <span className="text-zinc-400 font-mono font-black text-[11px] uppercase tracking-wider">Sort by:</span>
            </div>

            {options.map((opt) => {
              const isActive = opt.id === activeOptionId;
              return (
                <DropdownMenuPrimitive.Item 
                  key={opt.id} 
                  className="flex items-center gap-3 px-6 py-2.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group outline-none focus:bg-black/5 dark:focus:bg-white/5"
                  onSelect={() => onSelect(opt.id)}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    isActive ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "bg-transparent group-hover:bg-zinc-700"
                  )} />
                  <span className={cn(
                    "text-xs font-mono transition-colors",
                    isActive ? "text-zinc-900 dark:text-white font-bold" : "text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                  )}>
                    {opt.label}
                  </span>
                </DropdownMenuPrimitive.Item>
              );
            })}
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
});
SortMenu.displayName = "SortMenu";
