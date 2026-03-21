'use client';

import React, { useState, useCallback, forwardRef } from "react";
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
      group.options.forEach(opt => {
        initial[opt.id] = opt.isChecked;
      });
    });
    return initial;
};

/**
 * FilterBigMenu - Pattern: Horizontal Mega-Menu
 * Displays filter groups side-by-side in a terminal-inspired layout.
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
  const [prevGroups, setPrevGroups] = useState(groups);

  // Sync state with props during render (React recommended pattern for prop-to-state sync)
  if (groups !== prevGroups) {
    setPrevGroups(groups);
    setLocalOptions(getInitialOptions(groups));
  }

  // Notify parent about initial or changed selection
  const notifySelection = useCallback((options: Record<string, boolean>) => {
    if (onSelectionChange) {
      const selectedIds = Object.entries(options)
        .filter(([_, checked]) => checked)
        .map(([id]) => id);
      onSelectionChange(selectedIds);
    }
  }, [onSelectionChange]);

  const toggleOption = (id: string) => {
    const next = { ...localOptions, [id]: !localOptions[id] };
    setLocalOptions(next);
    notifySelection(next);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    const selectedIds = Object.entries(localOptions)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);
    onApply(selectedIds);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleared: Record<string, boolean> = {};
    Object.keys(localOptions).forEach(id => {
      cleared[id] = false;
    });
    setLocalOptions(cleared);
    notifySelection(cleared);
    onClearAll();
  };

  const renderGroup = (group: FilterGroup) => {
    if (group.type === 'checkbox') {
      return (
        <div key={group.id} className="flex flex-col min-w-[220px] border-r border-zinc-200 dark:border-white/5 last:border-r-0 pr-8 last:pr-0">
          <div className="py-2 mb-2">
            <span className="text-zinc-400 font-mono font-black text-[11px] uppercase tracking-widest">{group.title}</span>
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {group.options.map((opt) => {
              const isChecked = localOptions[opt.id];
              return (
                <div 
                  key={opt.id} 
                  className="flex items-center gap-3 py-1.5 px-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors group/item"
                  onClick={(e) => {
                      e.preventDefault();
                      toggleOption(opt.id);
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
                    {opt.label}
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
        <DropdownMenuPrimitive.Trigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all px-4 h-8 rounded-lg outline-none"
          >
            <Filter size={14} className="group-hover:scale-110 transition-transform" />
            Filters
          </Button>
        </DropdownMenuPrimitive.Trigger>
      )}
      
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content 
          ref={ref}
          sideOffset={12}
          align="start"
          className="z-[9999] bg-white/95 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col">
            {/* Horizontal Groups Container */}
            <div className="flex flex-row p-8 gap-8 items-start">
              {groups.map(renderGroup)}
            </div>
            
            {/* Action Buttons Footer */}
            <div className="py-4 px-8 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-end gap-4">
              <button 
                onClick={handleClear}
                className="mr-auto text-[10px] font-bold text-zinc-500 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-800"
              >
                Clear all
              </button>
              
              <DropdownMenuPrimitive.Item asChild>
                <Button 
                    variant="action" 
                    size="sm"
                    onClick={handleApply}
                    className="h-9 px-6 text-[11px] font-bold tracking-wider"
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
