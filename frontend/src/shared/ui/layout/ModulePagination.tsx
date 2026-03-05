"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ModulePaginationProps } from "@/shared/lib/types/module-pagination";

export const ModulePagination = ({
  pages = [],
  onPageChange,
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  className,
}: ModulePaginationProps) => {
  return (
    <div className={cn("pt-12 border-t border-zinc-100 dark:border-zinc-900", className)}>
      <div className="flex justify-start items-center gap-4">
        <button 
          className="h-8 w-8 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all disabled:opacity-30" 
          disabled={!canGoBack}
          onClick={onBack}
        >
          <ChevronLeft size={14} />
        </button>
        
        <div className="flex gap-2">
          {pages.map((page) => (
            <button 
              key={page.number}
              onClick={() => onPageChange?.(page.number)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-md border text-sm transition-colors font-bold",
                page.isActive 
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" 
                  : "border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white"
              )}
            >
              {page.number}
            </button>
          ))}
        </div>

        <button 
          className="h-8 w-8 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all disabled:opacity-30"
          disabled={!canGoNext}
          onClick={onNext}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
