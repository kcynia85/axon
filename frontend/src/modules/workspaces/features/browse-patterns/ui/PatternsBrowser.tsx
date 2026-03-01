"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { usePatternsBrowser } from "../application/usePatternsBrowser";
import { Pattern } from "@/shared/domain/workspaces";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Box } from "lucide-react";
import { cn } from "@/shared/lib/utils";
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

interface PatternsBrowserProps {
  initialPatterns: Pattern[];
}

export const PatternsBrowser: React.FC<PatternsBrowserProps> = ({ initialPatterns }) => {
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
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {processedPatterns.map((pattern) => (
            <Card key={pattern.id} className={cn(
              "group hover:border-primary/50 transition-all cursor-pointer h-full overflow-hidden flex flex-col",
              viewMode === "list" && "flex-row items-center px-6 py-4"
            )}>
              <CardHeader className={cn(viewMode === "list" ? "flex-1 p-0" : "pb-4")}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Box className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-bold font-display group-hover:text-primary transition-colors">
                      {pattern.name}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-none capitalize">
                    {pattern.type}
                  </Badge>
                </div>
                <CardDescription className={cn(
                  "mt-3 leading-relaxed",
                  viewMode === "grid" ? "line-clamp-3 min-h-[3rem]" : "line-clamp-1"
                )}>
                  {pattern.description}
                </CardDescription>
              </CardHeader>
              
              {viewMode === "list" && (
                <div className="border-l border-zinc-100 dark:border-zinc-900 pl-6 h-full flex items-center">
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest">Open</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
