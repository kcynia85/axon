"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useCrewsBrowser } from "../application/useCrewsBrowser";
import { Crew } from "@/shared/domain/workspaces";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Users, Workflow } from "lucide-react";
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
  { id: "newest", label: "Recently Formed" },
];

interface CrewsBrowserProps {
  initialCrews: Crew[];
}

export const CrewsBrowser: React.FC<CrewsBrowserProps> = ({ initialCrews }) => {
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
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {processedCrews.map((crew) => (
            <Link key={crew.id} href={`/workspaces/${workspaceId}/crews/${crew.id}`}>
              <Card className={cn(
                "group hover:border-primary/50 transition-all cursor-pointer h-full overflow-hidden flex flex-col",
                viewMode === "list" && "flex-row items-center"
              )}>
                <CardHeader className={cn(viewMode === "list" && "flex-1 pb-6")}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 font-black uppercase tracking-widest opacity-60">
                          {crew.crew_process_type}
                        </Badge>
                        <CardTitle className="text-lg font-bold font-display group-hover:text-primary transition-colors">
                          {crew.crew_name}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                        {crew.agent_member_ids.slice(0, 3).map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-zinc-100 dark:bg-zinc-800" />
                        ))}
                        {crew.agent_member_ids.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-background bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[8px] font-bold">
                                +{crew.agent_member_ids.length - 3}
                            </div>
                        )}
                    </div>
                  </div>
                  <CardDescription className={cn(
                    "mt-3 leading-relaxed",
                    viewMode === "grid" ? "line-clamp-3 min-h-[3rem]" : "line-clamp-1"
                  )}>
                    {crew.crew_description || "Dynamic tactical unit."}
                  </CardDescription>
                </CardHeader>
                
                <CardFooter className={cn(
                  "border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-auto",
                  viewMode === "grid" ? "flex justify-between bg-zinc-50/50 dark:bg-zinc-900/50" : "border-t-0 border-l px-6 py-0 h-full"
                )}>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <Workflow className="w-3 h-3" />
                    <span>{crew.agent_member_ids.length} Nodes</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest">Deploy</Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
