import React from "react";
import Image from "next/image";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import { AgentProfilePeek } from "@/modules/agents/ui/AgentProfilePeek";
import { cn, getAgentAvatarUrl } from "@/shared/lib/utils";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { BrowserEmptyState } from "@/shared/ui/complex/BrowserEmptyState";
import { UserCircle } from "lucide-react";
import { AgentsBrowserViewProps } from "./AgentsBrowserView.types";

/**
 * AgentsBrowserView: Pure view component for the agents inventory.
 * Standard: Pure View pattern, 0% logic, 0% useEffect.
 */
export const AgentsBrowserView = ({
  processedAgents,
  draftAgent,
  viewMode,
  setViewMode,
  colorName,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOptions,
  activeFilters,
  filterGroups,
  onToggleFilter,
  onRemoveFilter,
  onClearAllFilters,
  onClearAllFilters: onClearAll, // Compatibility with previous name if needed
  onApplyFilters,
  onPendingFilterIdsChange,
  resultsCount,
  isSidebarOpen,
  onCloseSidebar,
  activeAgent,
  onEditAgent,
  onDeleteAgent,
  onViewDetails,
  agentToDelete,
  affectedResources,
  isInspectionLoading,
  onConfirmDelete,
  onCancelDelete,
}: AgentsBrowserViewProps) => {
  const isGrid = viewMode === "grid";

  return (
    <BrowserLayout
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search agents..."
      activeFilters={activeFilters.length > 0 && (
        <FilterBar 
          activeFilters={activeFilters}
          onRemove={(filterId) => {
              const filterItem = activeFilters.find(filter => filter.id === filterId);
              if (filterItem) onRemoveFilter(filterItem);
          }}
          onClearAll={onClearAllFilters}
        />
      )}
      actionBar={
        <ActionBar 
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          quickFilters={[
            { label: "Role", groupId: 'roles' }
          ]}
          onToggleFilter={onToggleFilter}
          onApplyFilters={onApplyFilters}
          onClearAllFilters={onClearAllFilters}
          onPendingFilterIdsChange={onPendingFilterIdsChange}
          resultsCount={resultsCount}
          sortOptions={sortOptions}
          sortBy={sortBy}
          onSortChange={onSortChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
    >
      {processedAgents.length === 0 && !draftAgent ? (
        <BrowserEmptyState
            message="No agents found matching your criteria."
        />
      ) : (
        <div className={isGrid ? "grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "flex flex-col gap-8"}>
          {/* Draft Card */}
          {draftAgent && (
            <WorkspaceCard 
                key="agent-draft"
                variant="agent"
                layout={viewMode}
                title={draftAgent.agent_name || "New Agent"}
                description={draftAgent.agent_goal || "Resume creating this agent..."}
                badgeLabel={draftAgent.agent_role_text || "Draft Agent"}
                tags={draftAgent.agent_keywords}
                href="#"
                resourceId="draft"
                onClick={(mouseEvent) => {
                    mouseEvent.preventDefault();
                    onViewDetails("draft");
                }}
                onEdit={(mouseEvent) => {
                    mouseEvent.preventDefault();
                    mouseEvent.stopPropagation();
                    onEditAgent(draftAgent);
                }}
                onDelete={onDeleteAgent}
                colorName="default"
                isDraft={true}
                className="w-full"
                visualArea={
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-zinc-900/50 group-hover:bg-zinc-900/40 transition-colors">
                        <UserCircle className={cn(
                            "text-zinc-800 transition-all duration-500",
                            isGrid ? "w-24 h-24" : "w-12 h-12"
                        )} />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-500/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                }
            />
          )}

          {/* Agent Cards */}
          {processedAgents.map((agent, agentIndex) => {
            const avatarUrl = getAgentAvatarUrl(agent.id, agent.agent_visual_url);
            
            return (
              <WorkspaceCard 
                  key={agent.id}
                  variant="agent"
                  layout={viewMode}
                  title={agent.agent_name || "Agent Person"}
                  description={agent.agent_goal}
                  badgeLabel={agent.agent_role_text || "AI Agent"}
                  tags={agent.agent_keywords}
                  href="#"
                  resourceId={agent.id}
                  onEdit={(mouseEvent) => {
                      mouseEvent.preventDefault();
                      mouseEvent.stopPropagation();
                      onEditAgent(agent);
                  }}
                  onClick={(mouseEvent) => {
                      mouseEvent.preventDefault();
                      onViewDetails(agent.id);
                  }}
                  onDelete={onDeleteAgent}
                  colorName={colorName}
                  className="w-full"
                  visualArea={
                      <div className={cn(
                          "absolute inset-0 flex items-start justify-center overflow-hidden",
                          isGrid ? "pt-24" : "pt-0"
                      )}>
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                          
                          <div className="relative w-full h-full flex justify-center">
                              <Image 
                                  src={avatarUrl} 
                                  alt={agent.agent_name || "Agent"}
                                  fill
                                  sizes={isGrid ? "(max-width: 768px) 100vw, 252px" : "140px"}
                                  priority={agentIndex < 4}
                                  className={cn(
                                      "object-contain transition-all duration-500 group-hover:-translate-y-2",
                                      isGrid ? "scale-[1.25] origin-bottom" : "scale-[1.1] origin-top pt-2"
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
        agent={activeAgent}
        isOpen={isSidebarOpen}
        onClose={onCloseSidebar}
        onDelete={onDeleteAgent}
        onEdit={() => activeAgent && onEditAgent(activeAgent)}
      />

      <DestructiveDeleteModal
        isOpen={!!agentToDelete}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        title="Agent Deletion"
        resourceName={agentToDelete?.agent_name || "this agent"}
        affectedResources={affectedResources}
        isLoading={isInspectionLoading}
      />
    </BrowserLayout>
  );
};
