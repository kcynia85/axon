"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { usePatternsBrowser } from "../application/usePatternsBrowser";
import { Pattern } from "@/shared/domain/workspaces";
import { LayoutGrid } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { useDeletePattern } from "../../../application/usePatterns";
import { PatternProfilePeek } from "@/modules/workspaces/ui/PatternSidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { toast } from "sonner";
import { BrowserEmptyState } from "@/shared/ui/complex/BrowserEmptyState";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Designed" },
];

type PatternsBrowserProps = {
  readonly initialPatterns: Pattern[];
  readonly colorName?: string;
}

export const PatternsBrowser = ({ initialPatterns, colorName = "default" }: PatternsBrowserProps) => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const {
    processedPatterns,
    viewMode,
    setViewMode,
    selectedPatternId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
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

  const { mutate: deletePattern } = useDeletePattern(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  const [patternToDeleteId, setPatternToDeleteId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    const pattern = initialPatterns.find(p => p.id === id);
    const name = pattern?.pattern_name || "Pattern";
    deleteWithUndo(id, name, () => deletePattern(id));
  };

  const confirmDelete = () => {
    if (patternToDeleteId) {
      deletePattern(patternToDeleteId);
      setPatternToDeleteId(null);
      setIsSidebarOpen(false);
      toast.success("Wzorzec usunięty");
    }
  };

  const selectedPattern = initialPatterns.find(p => p.id === selectedPatternId) || null;

  return (
    <>
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
            quickFilters={[]}
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
          <BrowserEmptyState
            message={initialPatterns.length === 0 ? "No workflow patterns found. Design some sequences." : "No patterns found matching your criteria."}
          />
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-8"}>
            {processedPatterns.map((pattern) => (
              <WorkspaceCardHorizontal 
                  key={pattern.id}
                  title={pattern.pattern_name}
                  description={pattern.pattern_okr_context}
                  href={`/workspaces/${workspaceId}/patterns/${pattern.id}`}
                  badgeLabel="Workflow"
                  tags={pattern.pattern_keywords}
                  colorName={colorName}
                  icon={LayoutGrid}
                  resourceId={pattern.id}
                  onEdit={() => handleViewDetails(pattern.id)}
                  onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <PatternProfilePeek 
          pattern={selectedPattern}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onDelete={handleDelete}
        />
      </BrowserLayout>

      <DestructiveDeleteModal
        isOpen={!!patternToDeleteId}
        onClose={() => setPatternToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Pattern"
        resourceName={initialPatterns.find(p => p.id === patternToDeleteId)?.pattern_name || "this pattern"}
        affectedResources={[]}
      />
    </>
  );
};
