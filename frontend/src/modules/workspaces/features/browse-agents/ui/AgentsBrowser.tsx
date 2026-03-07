"use client";

import React from "react";
import Image from "next/image";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useAgentsBrowser } from "../application/useAgentsBrowser";
import { Agent } from "@/shared/domain/workspaces";
import { Bot } from "lucide-react";
import { useParams } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Added" },
];

const AGENT_REAL_NAMES: Record<string, string> = {
  "a-product-owner": "Alex Morgan",
  "a-tech-writer": "Elena Vance",
  "a-user-researcher": "Marcus Chen",
  "a-competitor-analyst": "Sarah Jenkins",
  "a-ui-designer": "Olivia Aris",
  "a-developer": "David Kessler",
  "a-qa-engineer": "Jordan Smith",
  "a-copywriter": "Mia Thorne",
};

const getDeterministicImgId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return (Math.abs(hash) % 5) + 1;
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
        <div className={viewMode === "grid" ? "flex flex-wrap gap-6" : "flex flex-col gap-4"}>
          {processedAgents.map((agent, index) => {
            const imgId = getDeterministicImgId(agent.id);
            return (
              <WorkspaceCard 
                  key={agent.id}
                  variant={viewMode === "grid" ? "agent" : "default"}
                  title={AGENT_REAL_NAMES[agent.id] || agent.agent_name || "Agent Person"}
                  description={agent.agent_goal}
                  href={`/workspaces/${workspaceId}/agents/${agent.id}`}
                  badgeLabel={agent.agent_role_text || "AI Agent"}
                  tags={agent.agent_keywords}
                  colorName={colorName}
                  className={viewMode === "grid" ? "w-[252px] shrink-0" : ""}
                  visualArea={
                      <div className="absolute inset-0 flex items-start justify-center overflow-hidden pt-24">
                          {/* Background Soft Glow (Consistent neutral black for all workspaces) */}
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                          
                          {/* Real Agent Image */}
                          <div className="relative w-full h-full flex justify-center">
                              <Image 
                                  src={`/images/avatars/agent-${imgId}.png`}
                                  alt={agent.agent_name}
                                  fill
                                  sizes="252px"
                                  priority={index < 4}
                                  className="object-contain scale-[1.25] origin-bottom transition-all duration-500 group-hover:-translate-y-2"
                              />
                          </div>
                      </div>
                  }
              />
            );
          })}
        </div>
      )}
    </BrowserLayout>
  );
};
