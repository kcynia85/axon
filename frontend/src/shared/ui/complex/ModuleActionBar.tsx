'use client';

import React from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { FilterPill } from "./FilterPill";
import { FilterBigMenu } from "./FilterBigMenu";
import { SortMenu } from "./SortMenu";
import { ViewModeSwitcher } from "./ViewModeSwitcher";

export type QuickFilter = {
  readonly label: string;
  readonly groupId: string;
};

interface ModuleActionBarProps {
  // Filter Props
  readonly filterGroups: readonly FilterGroup[];
  readonly activeFilters: readonly ActiveFilter[];
  readonly quickFilters?: readonly QuickFilter[];
  readonly onToggleFilter: (id: string) => void;
  readonly onApplyFilters: (selectedIds: string[]) => void;
  readonly onClearAllFilters: () => void;
  readonly onPendingFilterIdsChange?: (selectedIds: string[]) => void;
  readonly resultsCount?: number;

  // Sort Props
  readonly sortOptions: readonly SortOption[];
  readonly sortBy: string;
  readonly onSortChange: (id: string) => void;

  // View Props
  readonly viewMode: "grid" | "list";
  readonly onViewModeChange: (mode: "grid" | "list") => void;

  readonly className?: string;
}

/**
 * ModuleActionBar - A unified component for filtering, sorting, and view toggling.
 * Ensures consistent layout and spacing across all modules.
 */
export const ModuleActionBar: React.FC<ModuleActionBarProps> = ({
  filterGroups,
  activeFilters,
  quickFilters = [],
  onToggleFilter,
  onApplyFilters,
  onClearAllFilters,
  onPendingFilterIdsChange,
  resultsCount = 0,
  sortOptions,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  className,
}) => {
  return (
    <div className={cn(
      "flex flex-wrap items-center justify-between gap-6 pb-3 border-b border-zinc-100 dark:border-zinc-900",
      className
    )}>
      
      {/* Left side: Quick Filters + More Filters */}
      <div className="flex items-center gap-4 px-1">
        {quickFilters.length > 0 && (
          <div className="flex items-center gap-3">
            {quickFilters.map((qf) => (
              <FilterPill 
                key={qf.groupId}
                label={qf.label}
                group={filterGroups.find(g => g.id === qf.groupId)}
                activeFilters={activeFilters}
                onToggle={onToggleFilter}
              />
            ))}
          </div>
        )}

        {quickFilters.length > 0 && (
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
        )}

        <FilterBigMenu 
          groups={filterGroups}
          resultsCount={resultsCount}
          onApply={onApplyFilters}
          onClearAll={onClearAllFilters}
          onSelectionChange={onPendingFilterIdsChange}
          trigger={
            <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 mb-[-10px] group outline-none">
              <Filter size={14} className="group-hover:scale-110 transition-transform" />
              More Filters
            </button>
          }
        />
      </div>

      {/* Right side: Sort + View Switcher */}
      <div className="flex items-center gap-10">
        <SortMenu 
          options={sortOptions}
          activeOptionId={sortBy}
          onSelect={onSortChange}
          trigger={
            <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 mb-[-10px] outline-none">
              <ArrowUpDown size={14} />
              Sort
            </button>
          }
        />

        <div className="mb-[-10px]">
          <ViewModeSwitcher 
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      </div>
    </div>
  );
};
