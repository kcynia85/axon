'use client';

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/shared/lib/utils";
import { Check, X } from "lucide-react";

export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

interface FilterModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groups: FilterGroup[];
  onApply: (selectedIds: string[]) => void;
  onClearAll: () => void;
  trigger?: React.ReactNode;
}

/**
 * FilterModal - Pattern: Terminal/Code Editor Style
 * Designed for deep filtering across Agents, Crews, Projects, etc.
 */
export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onOpenChange,
  groups,
  onApply,
  onClearAll,
  trigger
}) => {
  // Local state for toggling checkboxes before applying
  const [localOptions, setLocalOptions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach(group => {
      group.options.forEach(opt => {
        initial[opt.id] = opt.checked;
      });
    });
    return initial;
  });

  const toggleOption = (id: string) => {
    setLocalOptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApply = () => {
    const selectedIds = Object.entries(localOptions)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);
    onApply(selectedIds);
    onOpenChange(false);
  };

  const handleClear = () => {
    const cleared: Record<string, boolean> = {};
    Object.keys(localOptions).forEach(id => {
      cleared[id] = false;
    });
    setLocalOptions(cleared);
    onClearAll();
  };

  // Flatten groups for line numbering
  const renderLines = () => {
    const lines: React.ReactNode[] = [];
    let currentLine = 1;

    groups.forEach((group) => {
      // Group Header
      lines.push(
        <div key={`header-${group.id}`} className="flex gap-6 group">
          <span className="w-6 text-right text-zinc-600 font-mono select-none text-xs leading-6">{currentLine++}</span>
          <span className="text-zinc-300 font-mono font-bold leading-6">{group.title}</span>
        </div>
      );

      // Options
      group.options.forEach((opt) => {
        const isChecked = localOptions[opt.id];
        lines.push(
          <div 
            key={`opt-${opt.id}`} 
            className="flex gap-6 group cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => toggleOption(opt.id)}
          >
            <span className="w-6 text-right text-zinc-600 font-mono select-none text-xs leading-6">{currentLine++}</span>
            <div className="flex items-center gap-3 font-mono leading-6">
              <div className={cn(
                "w-4 h-4 border border-zinc-500 rounded flex items-center justify-center transition-colors",
                isChecked ? "bg-white border-white" : "bg-transparent"
              )}>
                {isChecked && <Check size={12} className="text-black stroke-[4]" />}
              </div>
              <span className={cn(
                "transition-colors",
                isChecked ? "text-white" : "text-zinc-500"
              )}>
                {opt.label}
              </span>
            </div>
          </div>
        );
      });

      // Empty line between groups
      lines.push(
        <div key={`empty-${group.id}`} className="flex gap-6">
          <span className="w-6 text-right text-zinc-600 font-mono select-none text-xs leading-6">{currentLine++}</span>
          <span>&nbsp;</span>
        </div>
      );
    });

    // Footer Actions
    lines.push(
      <div key="footer" className="flex gap-6 mt-2 pt-4 border-t border-white/5">
        <span className="w-6 text-right text-zinc-600 font-mono select-none text-xs leading-6">{currentLine++}</span>
        <div className="flex items-center gap-4 font-mono font-bold text-sm leading-6">
          <button 
            onClick={handleApply}
            className="text-white hover:underline underline-offset-4 decoration-zinc-500"
          >
            Apply
          </button>
          <span className="text-zinc-700">|</span>
          <button 
            onClick={handleClear}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    );

    return lines;
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="bg-[#16161a] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl shadow-black/50 p-6">
            <div className="flex flex-col">
              {renderLines()}
            </div>
          </div>

          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 text-zinc-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
            <X size={16} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
