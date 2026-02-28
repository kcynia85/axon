'use client';

import React, { useState, useEffect } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { Check } from "lucide-react";
import { FilterGroup } from "@/shared/domain/filters";
import { Button } from "@/shared/ui/ui/Button";

interface FilterBigMenuProps {
  readonly groups: readonly FilterGroup[];
  readonly resultsCount?: number;
  readonly onApply: (selectedIds: string[]) => void;
  readonly onClearAll: () => void;
  readonly onSelectionChange?: (selectedIds: string[]) => void;
  readonly trigger: React.ReactNode;
}

/**
 * FilterBigMenu - Pattern: Horizontal Mega-Menu
 * Displays filter groups side-by-side in a terminal-inspired layout.
 */
export const FilterBigMenu: React.FC<FilterBigMenuProps> = ({
  groups,
  resultsCount = 0,
  onApply,
  onClearAll,
  onSelectionChange,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState<Record<string, string>>({});
  
  const [localOptions, setLocalOptions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach(group => {
      group.options.forEach(opt => {
        initial[opt.id] = opt.isChecked;
      });
    });
    return initial;
  });

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
    setLocalOptions(prev => {
      const next = { ...prev, [id]: !prev[id] };
      notifySelection(next);
      return next;
    });
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    const selectedIds = Object.entries(localOptions)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);
    onApply(selectedIds);
    setIsOpen(false);
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

  // Sync internal state if groups prop changes (e.g. from clear all in FilterBar)
  useEffect(() => {
    const next: Record<string, boolean> = {};
    groups.forEach(group => {
      group.options.forEach(opt => {
        next[opt.id] = opt.isChecked;
      });
    });
    setLocalOptions(next);
  }, [groups]);

  const renderGroup = (group: FilterGroup) => {
    if (group.type === 'checkbox') {
      return (
        <div key={group.id} className="flex flex-col min-w-[200px] border-r border-white/5 last:border-r-0 pr-8 last:pr-0">
          <div className="py-2 mb-2">
            <span className="text-zinc-400 font-mono font-black text-[11px] uppercase tracking-wider">{group.title}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {group.options.map((opt) => {
              const isChecked = localOptions[opt.id];
              return (
                <div 
                  key={opt.id} 
                  className="flex items-center gap-3 py-1 cursor-pointer hover:bg-white/5 rounded-sm transition-colors group/item"
                  onClick={(e) => {
                      e.preventDefault();
                      toggleOption(opt.id);
                  }}
                >
                  <div className={cn(
                    "w-3.5 h-3.5 border border-zinc-600 rounded-sm flex items-center justify-center transition-all shrink-0",
                    isChecked ? "bg-white border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "group-hover/item:border-zinc-400"
                  )}>
                    {isChecked && <Check size={10} className="text-black stroke-[4]" />}
                  </div>
                  <span className={cn(
                    "text-xs font-mono transition-colors truncate",
                    isChecked ? "text-white font-bold" : "text-zinc-500 group-hover/item:text-zinc-300"
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

    if (group.type === 'tags') {
      const query = tagSearch[group.id] || "";
      const filteredOptions = group.options.filter(opt => 
        opt.label.toLowerCase().includes(query.toLowerCase())
      );

      return (
        <div key={group.id} className="flex flex-col min-w-[240px] border-r border-white/5 last:border-r-0 pr-8 last:pr-0">
          <div className="py-2 mb-2 flex items-center gap-2 border-b border-white/5">
            <span className="text-zinc-400 font-mono font-black text-[11px] uppercase tracking-wider whitespace-nowrap">
              {group.title}
            </span>
            <input 
              type="text"
              autoFocus
              placeholder={group.placeholder || "[Search tags...]"}
              className="bg-transparent border-none outline-none font-mono text-[11px] text-white placeholder:text-zinc-700 w-full"
              value={query}
              onChange={(e) => setTagSearch(prev => ({ ...prev, [group.id]: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="mt-6 space-y-1">
            <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest block mb-3">Suggestions:</span>
            <div className="flex flex-col max-h-[200px] overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isChecked = localOptions[opt.id];
                  return (
                    <div 
                      key={opt.id} 
                      className="flex items-center gap-2 py-1 cursor-pointer hover:text-white group/tag transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleOption(opt.id);
                      }}
                    >
                      <span className={cn(
                        "font-mono text-xs",
                        isChecked ? "text-yellow-400 font-bold" : "text-zinc-500 group-hover/tag:text-zinc-300"
                      )}>
                        {opt.label.startsWith('#') ? opt.label : `#${opt.label}`}
                      </span>
                      {isChecked && <Check size={10} className="text-yellow-400" />}
                    </div>
                  );
                })
              ) : (
                <span className="text-zinc-800 font-mono text-[10px] italic py-2">No tags found</span>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) notifySelection(localOptions);
    }}>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content 
          sideOffset={12}
          align="start"
          className="z-50 bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl"
        >
          <div className="flex flex-col">
            {/* Horizontal Groups Container */}
            <div className="flex flex-row p-6 gap-8 items-start">
              {groups.map(renderGroup)}
            </div>
            
            {/* Action Buttons Footer */}
            <div className="py-4 px-6 bg-white/[0.03] border-t border-white/5 flex items-center justify-end gap-3">
              <button 
                onClick={handleClear}
                className="mr-auto text-[10px] font-bold text-zinc-500 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-800"
              >
                Wyczyść wszystko
              </button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={handleApply}
                className="h-8 px-4 text-[11px] font-bold bg-white text-black hover:bg-zinc-200 transition-all rounded-lg"
              >
                Show {resultsCount} results
              </Button>
            </div>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
