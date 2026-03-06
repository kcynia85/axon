"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { usePatternsBrowser } from "../application/usePatternsBrowser";
import { Pattern } from "@/shared/domain/workspaces";
import { Workflow } from "lucide-react";
import { SortOption } from "@/shared/domain/filters";
import { FilterPill } from "@/shared/ui/complex/FilterPill";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { ViewModeSwitcher } from "@/shared/ui/complex/ViewModeSwitcher";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { useParams } from "next/navigation";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Added" },
];

type PatternsBrowserProps = {
  readonly initialPatterns: Pattern[];
  readonly colorName?: string;
}

export const PatternsBrowser = ({ initialPatterns, colorName = "default" }: PatternsBrowserProps) => {
  const params = useParams();
  const workspaceId = params.workspace as string;
  const {
    processedPatterns,
    viewMode,
    setViewMode,
    filterConfig,
  } = usePatternsBrowser(initialPatterns);

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFilters,
    filterGroups,
    handleToggleFilter,
    handleRemoveFilter,
    handleClearAll,
    handleApplyFilters,
    getPreviewCount,
    setPendingFilterIds,
  } = filterConfig;

  return (
    <BrowserLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search patterns..."
      activeFilters={activeFilters.length > 0 && (
        <FilterBar 
          activeFilters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      )}
      filters={
        <div className="flex items-center gap-2">
          <FilterPill 
              label="By Type" 
              group={filterGroups.find(g => g.id === 'types')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
          />
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
          <FilterBigMenu 
              groups={filterGroups}
              resultsCount={getPreviewCount(initialPatterns)}
              onApply={handleApplyFilters}
              onClearAll={handleClearAll}
              onSelectionChange={setPendingFilterIds}
          />
        </div>
      }
      actions={
        <div className="flex items-center gap-6 mb-[-10px]">
          <SortMenu 
              options={SORT_OPTIONS}
              activeOptionId={sortBy}
              onSelect={setSortBy}
          />
          <ViewModeSwitcher 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
          />
        </div>
      }
    >
      {processedPatterns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground italic">No patterns found matching your criteria.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-4"}>
          {processedPatterns.map((pattern) => (
            <WorkspaceCardHorizontal 
                key={pattern.id}
                title={pattern.name || pattern.pattern_name}
                description={pattern.description || pattern.pattern_description}
                href={`/workspaces/${workspaceId}/patterns/${pattern.id}`}
                badgeLabel={pattern.type || "Workflow"}
                tags={pattern.pattern_keywords}
                icon={Workflow}
                colorName={colorName}
                footerLabel="View Blueprint"
            />
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
