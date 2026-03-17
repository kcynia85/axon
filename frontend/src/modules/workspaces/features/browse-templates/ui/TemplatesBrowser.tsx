"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useTemplatesBrowser } from "../application/useTemplatesBrowser";
import { Template } from "@/shared/domain/workspaces";
import { useParams, useRouter } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { useDeleteTemplate } from "@/modules/workspaces/application/useTemplates";
import { TemplateProfilePeek } from "@/modules/workspaces/ui/TemplateProfilePeek";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Added" },
];

type TemplatesBrowserProps = {
  readonly initialTemplates: Template[];
  readonly colorName?: string;
}

/**
 * TemplatesBrowser: UI for browsing templates in a workspace.
 * Standard: 0% useEffect, Pure View, arrow function.
 */
export const TemplatesBrowser = ({ initialTemplates, colorName = "default" }: TemplatesBrowserProps) => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const {
    processedTemplates,
    viewMode,
    setViewMode,
    selectedTemplateId,
    setSelectedTemplateId,
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

  const { mutate: deleteTemplate } = useDeleteTemplate();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      deleteTemplate({ workspaceId, id });
    }
  };

  const selectedTemplate = initialTemplates.find(t => t.id === selectedTemplateId) || null;

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
                title={template.template_name}
                description={template.template_description}
                href={`/workspaces/${workspaceId}/templates/${template.id}`}
                badgeLabel="Structure"
                tags={template.template_keywords}
                colorName={colorName}
                resourceId={template.id}
                onEdit={() => setSelectedTemplateId(template.id)}
                onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TemplateProfilePeek 
        template={selectedTemplate}
        isOpen={!!selectedTemplateId}
        onClose={() => setSelectedTemplateId(null)}
        onDelete={handleDelete}
        onEdit={() => {
          if (selectedTemplateId) {
            router.push(`/workspaces/${workspaceId}/templates/studio/${selectedTemplateId}`);
          }
        }}
      />
    </BrowserLayout>
  );
};
