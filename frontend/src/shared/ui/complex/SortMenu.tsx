'use client';

import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { SortOption } from "@/shared/domain/filters";

interface SortMenuProps {
  readonly options: readonly SortOption[];
  readonly activeOptionId: string;
  readonly onSelect: (optionId: string) => void;
  readonly trigger: React.ReactNode;
}

/**
 * SortMenu - Pattern: Minimalist Sort Dropdown
 */
export const SortMenu: React.FC<SortMenuProps> = ({
  options,
  activeOptionId,
  onSelect,
  trigger
}) => {
  const renderContent = () => {
    const elements: React.ReactNode[] = [];

    elements.push(
      <div key="header" className="px-6 py-2">
        <span className="text-zinc-400 font-mono font-black text-[11px] uppercase tracking-wider">Sort by:</span>
      </div>
    );

    options.forEach((opt) => {
      const isActive = opt.id === activeOptionId;
      elements.push(
        <div 
          key={`opt-${opt.id}`} 
          className="flex items-center gap-3 px-6 py-1.5 cursor-pointer hover:bg-white/5 transition-colors group"
          onClick={() => onSelect(opt.id)}
        >
          <div className={cn(
            "w-2 h-2 rounded-full transition-all",
            isActive ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "bg-transparent group-hover:bg-zinc-700"
          )} />
          <span className={cn(
            "text-xs font-mono transition-colors",
            isActive ? "text-white font-bold" : "text-zinc-500 group-hover:text-zinc-300"
          )}>
            {opt.label}
          </span>
        </div>
      );
    });

    return elements;
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content 
          sideOffset={8}
          align="end"
          className="z-50 min-w-[200px] bg-[#0c0c0e] border border-zinc-800 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="py-2">
            {renderContent()}
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
