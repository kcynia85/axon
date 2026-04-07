'use client';

import React, { useState, forwardRef } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { Check, Filter } from "lucide-react";
import { FilterGroup } from "@/shared/domain/filters";
import { Button } from "@/shared/ui/ui/Button";

interface FilterBigMenuProps {
  readonly groups: readonly FilterGroup[];
  readonly resultsCount?: number;
  readonly onApply: (selectedIds: string[]) => void;
  readonly onClearAll: () => void;
  readonly onSelectionChange?: (selectedIds: string[]) => void;
  readonly trigger?: React.ReactNode;
}

const getInitialOptions = (groups: readonly FilterGroup[]) => {
    const initial: Record<string, boolean> = {};
    groups.forEach(group => {
      group.options.forEach(option => {
        initial[option.id] = option.isChecked;
      });
    });
    return initial;
};

/**
 * FilterBigMenu - Pattern: Horizontal Mega-Menu
 * Displays filter groups side-by-side in a terminal-inspired layout.
 * Standard: Pure View pattern, Zero manual memoization.
 */
export const FilterBigMenu = forwardRef<HTMLDivElement, FilterBigMenuProps>(({
  groups,
  resultsCount = 0,
  onApply,
  onClearAll,
  onSelectionChange,
  trigger
}, ref) => {
  const [tagSearch, setTagSearch] = useState<Record<string, string>>({});
  
  const [localOptions, setLocalOptions] = useState<Record<string, boolean>>(() => getInitialOptions(groups));
  const [previousGroups, setPreviousGroups] = useState(groups);

  // Sync state with props during render (React recommended pattern for prop-to-state sync)
  if (groups !== previousGroups) {
    setPreviousGroups(groups);
    setLocalOptions(getInitialOptions(groups));
  }

  // Notify parent about initial or changed selection
  const notifySelection = (options: Record<string, boolean>) => {
    if (onSelectionChange) {
      const selectedIds = Object.entries(options)
        .filter(([_, checked]) => checked)
        .map(([id]) => id);
      onSelectionChange(selectedIds);
    }
  };

  const toggleOption = (id: string) => {
    const nextOptions = { ...localOptions, [id]: !localOptions[id] };
    setLocalOptions(nextOptions);
    notifySelection(nextOptions);
  };

  const handleApply = (mouseEvent: React.MouseEvent) => {
    mouseEvent.stopPropagation();
    const selectedIds = Object.entries(localOptions)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);
    onApply(selectedIds);
  };

  const handleClear = (mouseEvent: React.MouseEvent) => {
    mouseEvent.stopPropagation();
    const clearedOptions: Record<string, boolean> = {};
    Object.keys(localOptions).forEach(id => {
      clearedOptions[id] = false;
    });
    setLocalOptions(clearedOptions);
    notifySelection(clearedOptions);
    onClearAll();
  };

  const renderGroup = (group: FilterGroup) => {
    if (group.type === 'checkbox') {
      return (
        <div key={group.id} className="flex flex-col min-w-[200px] border-r border-zinc-200 dark:border-white/5 last:border-r-0 pr-8 last:pr-0">
          <div className="py-2 mb-2">
            <span className="text-zinc-400 font-mono font-black text-[11px] uppercase tracking-wider">{group.title}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {group.options.map((option) => {
              const isChecked = localOptions[option.id];
              return (
                <div 
                  key={option.id} 
                  className="flex items-center gap-3 py-1 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-sm transition-colors group/item"
                  onClick={(mouseEvent) => {
                      mouseEvent.preventDefault();
                      toggleOption(option.id);
                  }}
                >
                  <div className={cn(
                    "w-3.5 h-3.5 border border-zinc-300 dark:border-zinc-600 rounded-sm flex items-center justify-center transition-all shrink-0",
                    isChecked ? "bg-black dark:bg-white border-black dark:border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "group-hover/item:border-zinc-400"
                  )}>
                    {isChecked && <Check size={10} className="text-white dark:text-black stroke-[4]" />}
                  </div>
                  <span className={cn(
                    "text-xs font-mono transition-colors truncate",
                    isChecked ? "text-zinc-900 dark:text-white font-bold" : "text-zinc-500 group-hover/item:text-zinc-700 dark:group-hover/item:text-zinc-300"
                  )}>
                    {option.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <DropdownMenuPrimitive.Root onOpenChange={(open) => {
        if (open) notifySelection(localOptions);
    }}>
      {trigger ? (
        <DropdownMenuPrimitive.Trigger asChild>
          {trigger}
        </DropdownMenuPrimitive.Trigger>
      ) : (
        <DropdownMenuPrimitive.Trigger className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 mb-[-10px] group w-fit">
            <Filter size={14} className="group-hover:scale-110 transition-transform" />
            More Filters
        </DropdownMenuPrimitive.Trigger>
      )}
      
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content 
          ref={ref}
          sideOffset={12}
          align="start"
          className="z-[9999] bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col">
            {/* Horizontal Groups Container */}
            <div className="flex flex-row p-6 gap-8 items-start">
              {groups.map(renderGroup)}
            </div>
            
            {/* Action Buttons Footer */}
            <div className="py-4 px-6 bg-black/[0.02] dark:bg-white/[0.03] border-t border-zinc-200 dark:border-white/5 flex items-center justify-end gap-3">
              <button 
                onClick={handleClear}
                className="mr-auto text-[10px] font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-800"
              >
                Clear all
              </button>
              
              <DropdownMenuPrimitive.Item asChild>
                <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleApply}
                    className="h-8 px-4 text-[11px] font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all rounded-lg outline-none"
                >
                    Show {resultsCount} results
                </Button>
              </DropdownMenuPrimitive.Item>
            </div>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
});
FilterBigMenu.displayName = "FilterBigMenu";
