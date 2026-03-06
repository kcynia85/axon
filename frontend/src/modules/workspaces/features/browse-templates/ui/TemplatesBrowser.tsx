"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useTemplatesBrowser } from "../application/useTemplatesBrowser";
import { Template } from "@/shared/domain/workspaces";
import { FileText, ListTodo } from "lucide-react";
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
      filters={
        <div className="flex items-center gap-2">
          <FilterPill 
              label="By Category" 
              group={filterGroups.find(g => g.id === 'categories')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
          />
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
          <FilterBigMenu 
              groups={filterGroups}
              resultsCount={getPreviewCount(initialTemplates)}
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
      {processedTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground italic">No templates found matching your criteria.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-4"}>
          {processedTemplates.map((template) => (
            <WorkspaceCardHorizontal 
                key={template.id}
                title={template.name || template.template_name}
                description={template.description || template.template_description}
                href={`/workspaces/${workspaceId}/templates/${template.id}/edit`}
                badgeLabel={template.category || template.template_type}
                tags={template.tags || template.template_keywords}
                icon={FileText}
                colorName={colorName}
                footerContent={
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <ListTodo className="w-3 h-3" />
                        <span>{template.template_checklist_items?.length || 0} Tasks</span>
                    </div>
                }
            />
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
