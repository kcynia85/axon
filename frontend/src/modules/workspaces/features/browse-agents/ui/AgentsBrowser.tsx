"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useAgentsBrowser } from "../application/useAgentsBrowser";
import { Agent } from "@/shared/domain/workspaces";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Box, Edit2 } from "lucide-react";
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
  { id: "newest", label: "Recently Added" },
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

type AgentsBrowserProps = {
  readonly initialAgents: Agent[];
  readonly colorName?: string;
}

export const AgentsBrowser = ({ initialAgents, colorName = "default" }: AgentsBrowserProps) => {
  const params = useParams();
  const workspaceId = params.workspace as string;
  const {
    processedAgents,
    viewMode,
    setViewMode,
    filterConfig,
  } = useAgentsBrowser(initialAgents);

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
      searchPlaceholder="Search agents..."
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
              label="By Role" 
              group={filterGroups.find(g => g.id === 'roles')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
          />
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
          <FilterBigMenu 
              groups={filterGroups}
              resultsCount={getPreviewCount(initialAgents)}
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
      {processedAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground italic">No agents found matching your criteria.</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {processedAgents.map((agent) => (
            <Link key={agent.id} href={`/workspaces/${workspaceId}/agents/${agent.id}`}>
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
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-black bg-muted/30 border-none">
                        {agent.role || agent.agent_role_text}
                      </Badge>
                      <CardTitle className="text-lg font-bold font-display group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {agent.agent_name || "Untitled Agent"}
                      </CardTitle>
                    </div>
                    {viewMode === "grid" && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400">
                                <Edit2 className="w-3 h-3" />
                            </Button>
                        </div>
                    )}
                  </div>
                  <CardDescription className={cn(
                    "mt-3 leading-relaxed",
                    viewMode === "grid" ? "line-clamp-3 min-h-[4.5rem]" : "line-clamp-1"
                  )}>
                    {agent.goal || agent.agent_goal}
                  </CardDescription>
                </CardHeader>
                
                {viewMode === "grid" && (
                  <CardContent className="relative z-10 mt-auto pt-0 pb-6">
                    <div className="flex items-center gap-1 flex-wrap">
                      {(agent.keywords || agent.agent_keywords)?.slice(0, 2).map(kw => (
                        <span key={kw} className="text-[10px] text-muted-foreground font-medium italic">#{kw}</span>
                      ))}
                    </div>
                  </CardContent>
                )}

                {viewMode === "list" && (
                  <div className="relative z-10 px-6 border-l border-zinc-100 dark:border-zinc-900 flex items-center gap-4 h-full py-4">
                     <div className="flex gap-2">
                      {(agent.keywords || agent.agent_keywords)?.slice(0, 2).map(kw => (
                        <Badge key={kw} variant="secondary" className="text-[9px] bg-zinc-100 dark:bg-zinc-800 border-none">#{kw}</Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest">Details</Button>
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
