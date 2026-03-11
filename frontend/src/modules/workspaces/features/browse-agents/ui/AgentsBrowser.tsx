"use client";

import React from "react";
import Image from "next/image";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useAgentsBrowser } from "../application/useAgentsBrowser";
import { Agent } from "@/shared/domain/workspaces";
import { useParams } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import { AgentProfilePeek } from "@/modules/workspaces/ui/AgentProfilePeek";
import { cn, getDeterministicImgId } from "@/shared/lib/utils";
import { AGENT_REAL_NAMES } from "@/modules/workspaces/domain/constants";

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
    selectedAgentId,
    setIsSidebarOpen,
    isSidebarOpen,
    handleViewDetails,
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

  const selectedAgent = initialAgents.find(a => a.id === selectedAgentId) || null;

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
      actionBar={
        <ActionBar 
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          quickFilters={[
            { label: "Narzędzia", groupId: 'tools' },
            { label: "Siła", groupId: 'strength' },
            { label: "Rola", groupId: 'roles' },
            { label: "Status", groupId: 'status' },
          ]}
          onToggleFilter={handleToggleFilter}
          onApplyFilters={handleApplyFilters}
          onClearAllFilters={handleClearAll}
          onPendingFilterIdsChange={setPendingFilterIds}
          resultsCount={getPreviewCount(initialAgents)}
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
    >
      {processedAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground italic">No agents found matching your criteria.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "flex flex-wrap gap-6" : "flex flex-col gap-8"}>
          {processedAgents.map((agent, index) => {
            const imgId = getDeterministicImgId(agent.id);
            return (
              <WorkspaceCard 
                  key={agent.id}
                  variant="agent"
                  layout={viewMode}
                  title={AGENT_REAL_NAMES[agent.id] || agent.agent_name || "Agent Person"}
                  description={agent.agent_goal}
                  href={`/workspaces/${workspaceId}/agents/${agent.id}`}
                  badgeLabel={agent.agent_role_text || "AI Agent"}
                  tags={agent.agent_keywords}
                  onEdit={() => handleViewDetails(agent.id)}
                  colorName={colorName}
                  className={viewMode === "grid" ? "w-[252px] shrink-0" : ""}
                  visualArea={
                      <div className={cn(
                          "absolute inset-0 flex items-start justify-center overflow-hidden",
                          viewMode === "grid" ? "pt-24" : "pt-0"
                      )}>
                          {/* Background Soft Glow (Consistent neutral black for all workspaces) */}
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                          
                          {/* Real Agent Image */}
                          <div className="relative w-full h-full flex justify-center">
                              <Image 
                                  src={`/images/avatars/agent-${imgId}.png`}
                                  alt={agent.agent_name}
                                  fill
                                  sizes={viewMode === "grid" ? "252px" : "140px"}
                                  priority={index < 4}
                                  className={cn(
                                      "object-contain transition-all duration-500 group-hover:-translate-y-2",
                                      viewMode === "grid" ? "scale-[1.25] origin-bottom" : "scale-[1.1] origin-top pt-2"
                                  )}
                              />
                          </div>
                      </div>
                  }
              />
            );
          })}
        </div>
      )}

      <AgentProfilePeek 
        agent={selectedAgent}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onEdit={() => {}} // TODO: Handle edit
      />
    </BrowserLayout>
  );
};
