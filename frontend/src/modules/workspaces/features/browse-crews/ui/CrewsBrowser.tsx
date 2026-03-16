"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useCrewsBrowser } from "../application/useCrewsBrowser";
import { Crew } from "@/shared/domain/workspaces";
import { Workflow } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { useDeleteCrew } from "@/modules/workspaces/application/useCrews";
import { CrewProfilePeek } from "@/modules/workspaces/ui/CrewProfilePeek";

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
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const {
    processedCrews,
    viewMode,
    setViewMode,
    selectedCrewId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
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

  const { mutate: deleteCrew } = useDeleteCrew();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this crew?")) {
      deleteCrew({ workspaceId, id });
    }
  };

  const selectedCrew = initialCrews.find(c => c.id === selectedCrewId) || null;

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
      actionBar={
        <ActionBar 
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          quickFilters={[
            { label: "Procesy", groupId: 'process-types' }
          ]}
          onToggleFilter={handleToggleFilter}
          onApplyFilters={handleApplyFilters}
          onClearAllFilters={handleClearAll}
          onPendingFilterIdsChange={setPendingFilterIds}
          resultsCount={getPreviewCount(initialCrews)}
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
    >
      {processedCrews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground italic">No crews found matching your criteria.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-8"}>
          {processedCrews.map((crew) => (
            <WorkspaceCardHorizontal 
                key={crew.id}
                variant="crew"
                title={crew.crew_name}
                description={crew.crew_description}
                href={`/workspaces/${workspaceId}/crews/${crew.id}`}
                badgeLabel={crew.crew_process_type}
                tags={crew.crew_keywords}
                colorName={colorName}
                agentIds={crew.agent_member_ids}
                onEdit={() => handleViewDetails(crew.id)}
                onDelete={() => handleDelete(crew.id)}
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

      <CrewProfilePeek 
        crew={selectedCrew}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onEdit={() => {
          if (selectedCrewId) {
            router.push(`/workspaces/${workspaceId}/crews/studio/${selectedCrewId}`);
          }
        }}
      />
    </BrowserLayout>
  );
};
