'use client';

import React, { useState } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { Check } from "lucide-react";
import { FilterGroup } from "@/shared/domain/filters";

interface FilterBigMenuProps {
  readonly groups: readonly FilterGroup[];
  readonly onApply: (selectedIds: string[]) => void;
  readonly onClearAll: () => void;
  readonly trigger: React.ReactNode;
}

/**
 * FilterBigMenu - Pattern: Large Expandable Menu
 */
export const FilterBigMenu: React.FC<FilterBigMenuProps> = ({
  groups,
  onApply,
  onClearAll,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [localOptions, setLocalOptions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach(group => {
      group.options.forEach(opt => {
        initial[opt.id] = opt.isChecked;
      });
    });
    return initial;
  });

  const toggleOption = (id: string) => {
    setLocalOptions(prev => ({ ...prev, [id]: !prev[id] }));
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
    onClearAll();
  };

  const renderContent = () => {
    const elements: React.ReactNode[] = [];

    groups.forEach((group) => {
      elements.push(
        <div key={`header-${group.id}`} className="px-6 py-2">
          <span className="text-zinc-400 font-mono font-black text-[11px] uppercase tracking-wider">{group.title}</span>
        </div>
      );

      group.options.forEach((opt) => {
        const isChecked = localOptions[opt.id];
        elements.push(
          <div 
            key={`opt-${opt.id}`} 
            className="flex items-center gap-3 px-6 py-1.5 cursor-pointer hover:bg-white/5 transition-colors group"
            onClick={(e) => {
                e.preventDefault();
                toggleOption(opt.id);
            }}
          >
            <div className={cn(
              "w-3.5 h-3.5 border border-zinc-600 rounded-sm flex items-center justify-center transition-all",
              isChecked ? "bg-white border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "bg-transparent group-hover:border-zinc-400"
            )}>
              {isChecked && <Check size={10} className="text-black stroke-[4]" />}
            </div>
            <span className={cn(
              "text-xs font-mono transition-colors",
              isChecked ? "text-white font-bold" : "text-zinc-500 group-hover:text-zinc-300"
            )}>
              {opt.label}
            </span>
          </div>
        );
      });

      elements.push(<div key={`spacer-${group.id}`} className="h-2" />);
    });

    return elements;
  };

  return (
    <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content 
          sideOffset={8}
          align="end"
          className="z-50 min-w-[280px] bg-[#0c0c0e] border border-zinc-800 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="py-2">
            {renderContent()}
            
            <div className="mt-2 py-4 px-6 bg-black/40 border-t border-white/5">
              <div className="flex items-center gap-4 font-mono font-black text-[11px] uppercase tracking-[0.2em]">
                <button 
                  onClick={handleApply}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  Apply
                </button>
                <span className="text-zinc-800">|</span>
                <button 
                  onClick={handleClear}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
