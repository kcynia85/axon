'use client';

import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ViewModeSwitcherProps {
  readonly viewMode: "grid" | "list";
  readonly onViewModeChange: (mode: "grid" | "list") => void;
}

export const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center gap-6">
      <button
        type="button"
        onClick={() => onViewModeChange("grid")}
        className={cn(
          "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all pb-2 w-fit outline-none cursor-pointer",
          viewMode === "grid"
            ? "border-black dark:border-white text-black dark:text-white"
            : "border-transparent text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
        )}
      >
        <LayoutGrid size={14} />
        Grid
      </button>
      <button
        type="button"
        onClick={() => onViewModeChange("list")}
        className={cn(
          "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all pb-2 w-fit outline-none cursor-pointer",
          viewMode === "list"
            ? "border-black dark:border-white text-black dark:text-white"
            : "border-transparent text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
        )}
      >
        <List size={14} />
        List
      </button>
    </div>
  );
};
