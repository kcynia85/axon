'use client';

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption } from "@/shared/domain/filters";
import { SpaceList } from "./SpaceList";
import { RecentlyUsed } from "./RecentlyUsed";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { SearchInput } from "@/shared/ui/complex/SearchInput";
import { useSpacesBrowser } from "../application/hooks/useSpacesBrowser";
import type { SpacesBrowserProps } from "./types";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "By Status", groupId: "status" },
  { label: "By Type", groupId: "type" },
];

export const SpacesBrowser = ({ initialSpaces }: SpacesBrowserProps) => {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    activeFilters,
    filterGroups,
    processedSpaces,
    previewResultsCount,
    handleToggleFilter,
    handleRemoveFilter,
    handleClearAll,
    handleApplyFilters,
    setPendingFilterIds
  } = useSpacesBrowser(initialSpaces);

  return (
    <div className="space-y-12">
      <div className="flex flex-col space-y-12">
        {/* Row 1: Recently Used */}
        <RecentlyUsed spaces={initialSpaces} className="animate-in fade-in slide-in-from-top-2 duration-300" />

        {/* Row 2: Search */}
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search Spaces..."
        />

        {/* Row 3: Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Active Filters</span>
            <FilterBar 
              activeFilters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
              className="px-1"
            />
          </div>
        )}
      </div>

      {/* Unified Action Bar (Filters, Sort, View) */}
      <ActionBar 
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        quickFilters={QUICK_FILTERS}
        onToggleFilter={handleToggleFilter}
        onApplyFilters={handleApplyFilters}
        onClearAllFilters={handleClearAll}
        onPendingFilterIdsChange={setPendingFilterIds}
        resultsCount={previewResultsCount}
        sortOptions={SORT_OPTIONS}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="pt-2">
        <SpaceList spaces={processedSpaces} viewMode={viewMode} />
      </div>
    </div>
  );
};
