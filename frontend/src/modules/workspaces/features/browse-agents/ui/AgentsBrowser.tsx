"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useAgentsBrowser } from "../application/useAgentsBrowser";
import { Agent } from "@/shared/domain/workspaces";
import { User, Bot } from "lucide-react";
import { useParams } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { FilterPill } from "@/shared/ui/complex/FilterPill";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { ViewModeSwitcher } from "@/shared/ui/complex/ViewModeSwitcher";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Added" },
];

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
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
          {processedAgents.map((agent) => (
            <WorkspaceCard 
                key={agent.id}
                variant={viewMode === "grid" ? "agent" : "default"}
                title={agent.agent_name || "Untitled Agent"}
                description={agent.agent_goal}
                href={`/workspaces/${workspaceId}/agents/${agent.id}`}
                badgeLabel={agent.agent_role_text || "AI Agent"}
                tags={agent.agent_keywords}
                icon={Bot}
                colorName={colorName}
                visualArea={
                    <div className="absolute inset-0 flex items-start justify-center overflow-hidden pt-9">
                        {/* Background Soft Glow (Lowered, fading up for clarity) */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-100/[0.04] to-transparent dark:from-zinc-900/[0.04] dark:to-transparent" />
                        
                        {/* Real Agent Image */}
                        <div className="relative w-full h-full flex justify-center px-4">
                            <img 
                                src={`/images/avatars/agent-${((agent.id.charCodeAt(agent.id.length - 1) % 5) + 1)}.png`}
                                alt={agent.agent_name}
                                className="w-full h-full object-contain scale-110 origin-bottom transition-all duration-700 brightness-[1.15] contrast-[1.05] group-hover:brightness-[1.22] group-hover:contrast-[1.10] group-hover:-translate-y-2"
                            />
                        </div>
                    </div>
                }
            />
          ))}
        </div>
      )}
    </BrowserLayout>
  );
};
