"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useCrewsBrowser } from "../application/useCrewsBrowser";
import { Crew } from "@/shared/domain/workspaces";
import { Users, Workflow } from "lucide-react";
import { useParams } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { FilterPill } from "@/shared/ui/complex/FilterPill";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { ViewModeSwitcher } from "@/shared/ui/complex/ViewModeSwitcher";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Formed" },
];

type CrewsBrowserProps = {
  readonly initialCrews: Crew[];
  readonly colorName?: string;
}

export const CrewsBrowser = ({ initialCrews, colorName = "default" }: CrewsBrowserProps) => {
  const params = useParams();
  const workspaceId = params.workspace as string;
  const {
    processedCrews,
    viewMode,
    setViewMode,
    filterConfig,
  } = useCrewsBrowser(initialCrews);

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
      searchPlaceholder="Search crews..."
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
              label="By Process" 
              group={filterGroups.find(g => g.id === 'process-types')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
          />
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
          <FilterBigMenu 
              groups={filterGroups}
              resultsCount={getPreviewCount(initialCrews)}
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
      {processedCrews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground italic">No crews found matching your criteria.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-4"}>
          {processedCrews.map((crew) => (
            <WorkspaceCardHorizontal 
                key={crew.id}
                title={crew.crew_name}
                description={crew.crew_description}
                href={`/workspaces/${workspaceId}/crews/${crew.id}`}
                badgeLabel={crew.crew_process_type}
                tags={crew.crew_keywords}
                icon={Users}
                colorName={colorName}
                footerContent={
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <Workflow className="w-3 h-3" />
                        <span>{crew.agent_member_ids.length} Nodes</span>
                    </div>
                }
            />
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
