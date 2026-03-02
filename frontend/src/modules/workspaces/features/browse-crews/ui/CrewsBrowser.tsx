"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useCrewsBrowser } from "../application/useCrewsBrowser";
import { Crew } from "@/shared/domain/workspaces";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/shared/ui/ui/Card";
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
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Formed" },
];

const COLOR_TO_RGB: Record<string, string> = {
    blue: "59, 130, 246",
    purple: "168, 85, 247",
    pink: "236, 72, 153",
    green: "34, 197, 94",
    yellow: "234, 179, 8",
    orange: "249, 115, 22",
    default: "113, 113, 122"
};

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

  const styles = getVisualStylesForZoneColor(colorName);
  const rgb = COLOR_TO_RGB[colorName] || COLOR_TO_RGB.default;

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
                "group transition-all cursor-pointer h-full overflow-hidden flex flex-col pt-2 relative rounded-xl",
                "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
                "hover:shadow-md",
                `hover:${styles.borderClassName}`,
                viewMode === "list" && "flex-row items-center pt-0"
              )}>
                {/* Accent Top Bar (Grid mode) */}
                {viewMode === "grid" && (
                    <div 
                        className={cn("absolute top-0 left-0 right-0 h-[2px] opacity-40 transition-opacity duration-200 group-hover:opacity-100 z-10", styles.hoverBackgroundClassName)} 
                    />
                )}

                {/* Accent Side Bar (List mode) */}
                {viewMode === "list" && (
                    <div 
                        className={cn("absolute top-0 bottom-0 left-0 w-[2px] opacity-40 transition-opacity duration-200 group-hover:opacity-100 z-10", styles.hoverBackgroundClassName)} 
                    />
                )}

                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" 
                    style={{ backgroundImage: `radial-gradient(rgb(${rgb}) 0.5px, transparent 0.5px)`, backgroundSize: '12px 12px' }} 
                />

                <CardHeader className={cn("relative z-10", viewMode === "list" && "flex-1 pb-6 py-4")}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-muted/30">
                        <Users className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div className="space-y-0.5">
                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 font-black uppercase tracking-widest bg-muted/30 border-none">
                          {crew.crew_process_type}
                        </Badge>
                        <CardTitle className="text-lg font-bold font-display group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                          {crew.crew_name}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                        {crew.agent_member_ids.slice(0, 3).map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-muted flex items-center justify-center text-[8px] font-bold shadow-sm" />
                        ))}
                        {crew.agent_member_ids.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-blue-500/10 text-blue-600 flex items-center justify-center text-[8px] font-bold shadow-sm">
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
                
                {viewMode === "grid" && (
                  <CardContent className="relative z-10 mt-auto pt-0 pb-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <Workflow className="w-3 h-3" />
                        <span>{crew.agent_member_ids.length} Nodes</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest">Deploy</Button>
                  </CardContent>
                )}

                {viewMode === "list" && (
                  <div className="relative z-10 px-6 border-l border-zinc-100 dark:border-zinc-900 flex items-center gap-4 h-full py-4">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <Workflow className="w-3 h-3" />
                        <span>{crew.agent_member_ids.length} Nodes</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest">Deploy</Button>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
