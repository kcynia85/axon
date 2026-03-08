"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { usePatternsBrowser } from "../application/usePatternsBrowser";
import { Pattern } from "@/shared/domain/workspaces";
import { Workflow } from "lucide-react";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
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
      actionBar={
        <ActionBar 
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          quickFilters={[
            { label: "Typy", groupId: 'types' }
          ]}
          onToggleFilter={handleToggleFilter}
          onApplyFilters={handleApplyFilters}
          onClearAllFilters={handleClearAll}
          onPendingFilterIdsChange={setPendingFilterIds}
          resultsCount={getPreviewCount(initialPatterns)}
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
    >
      {processedPatterns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground italic">No patterns found matching your criteria.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-8"}>
          {processedPatterns.map((pattern) => (
            <WorkspaceCardHorizontal 
                key={pattern.id}
                variant="default"
                title={pattern.pattern_name || (pattern as any).name}
                description={(pattern as any).pattern_description || (pattern as any).description || "Optimized process sequence."}
                href={`/workspaces/${workspaceId}/patterns/${pattern.id}`}
                badgeLabel="Pattern"
                tags={pattern.pattern_keywords}
                colorName={colorName}
            />
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
