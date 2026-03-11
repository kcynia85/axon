"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useTemplatesBrowser } from "../application/useTemplatesBrowser";
import { Template } from "@/shared/domain/workspaces";
import { FileText, ListTodo } from "lucide-react";
import { useParams } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Added" },
];

type TemplatesBrowserProps = {
  readonly initialTemplates: Template[];
  readonly colorName?: string;
}

export const TemplatesBrowser = ({ initialTemplates, colorName = "default" }: TemplatesBrowserProps) => {
  const params = useParams();
  const workspaceId = params.workspace as string;
  const {
    processedTemplates,
    viewMode,
    setViewMode,
    filterConfig,
  } = useTemplatesBrowser(initialTemplates);

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
      searchPlaceholder="Search templates..."
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
            { label: "Kategorie", groupId: 'categories' }
          ]}
          onToggleFilter={handleToggleFilter}
          onApplyFilters={handleApplyFilters}
          onClearAllFilters={handleClearAll}
          onPendingFilterIdsChange={setPendingFilterIds}
          resultsCount={getPreviewCount(initialTemplates)}
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
    >
      {processedTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground italic">No templates found matching your criteria.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-8"}>
          {processedTemplates.map((template) => (
            <WorkspaceCardHorizontal 
                key={template.id}
                variant="default"
                title={template.name || template.template_name}
                description={template.description || template.template_description}
                href={`/workspaces/${workspaceId}/templates/studio?id=${template.id}`}
                badgeLabel={template.category || template.template_type}
                tags={template.tags || template.template_keywords}
                colorName={colorName}
            />
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
