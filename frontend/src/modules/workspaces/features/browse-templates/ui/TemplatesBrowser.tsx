"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useTemplatesBrowser } from "../application/useTemplatesBrowser";
import { Template } from "@/shared/domain/workspaces";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Copy, ListTodo } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { FilterPill } from "@/shared/ui/complex/FilterPill";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { ViewModeSwitcher } from "@/shared/ui/complex/ViewModeSwitcher";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Added" },
];

interface TemplatesBrowserProps {
  initialTemplates: Template[];
}

export const TemplatesBrowser: React.FC<TemplatesBrowserProps> = ({ initialTemplates }) => {
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
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {processedTemplates.map((template) => (
            <Card key={template.id} className={cn(
              "group hover:border-primary/50 transition-all h-full overflow-hidden flex flex-col",
              viewMode === "list" && "flex-row items-center"
            )}>
              <CardHeader className={cn(viewMode === "list" && "flex-1 pb-6")}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors text-primary">
                      <Copy className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 font-black uppercase tracking-widest opacity-60">
                        {template.category}
                      </Badge>
                      <CardTitle className="text-lg font-bold font-display group-hover:text-primary transition-colors">
                        {template.name}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold h-5 flex items-center gap-1">
                    <ListTodo className="w-2.5 h-2.5" /> {template.template_checklist_items?.length || 0} Tasks
                  </Badge>
                </div>
                <CardDescription className={cn(
                  "mt-3 leading-relaxed",
                  viewMode === "grid" ? "line-clamp-3 min-h-[3rem]" : "line-clamp-1"
                )}>
                  {template.description}
                </CardDescription>
                
                {viewMode === "grid" && template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {template.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[9px] bg-zinc-100 dark:bg-zinc-900 border-none">#{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              
              <CardFooter className={cn(
                "border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-auto",
                viewMode === "grid" ? "flex justify-between bg-zinc-50/50 dark:bg-zinc-900/50" : "border-t-0 border-l px-6 py-0 h-full"
              )}>
                {viewMode === "grid" && (
                  <span className="text-[9px] text-muted-foreground font-mono opacity-60 uppercase tracking-widest">SOP Module</span>
                )}
                <Button variant="ghost" size="sm" asChild className="h-7 text-[10px] font-black uppercase tracking-widest">
                  <Link href={`/workspaces/${workspaceId}/templates/${template.id}/edit`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
