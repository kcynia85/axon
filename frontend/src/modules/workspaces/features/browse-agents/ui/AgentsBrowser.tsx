"use client";

import React from "react";
import Image from "next/image";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useAgentsBrowser } from "../application/useAgentsBrowser";
import { Agent } from "@/shared/domain/workspaces";
import { useParams, useRouter } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import { useDeleteAgent, useInspectAgentDeletion } from "@/modules/agents/infrastructure/useAgents";
import { useAgentDraft } from "@/modules/agents/application/useAgentDraft";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { AgentProfilePeek } from "@/modules/workspaces/ui/AgentProfilePeek";
import { cn, getAgentAvatarUrl } from "@/shared/lib/utils";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { BrowserEmptyState } from "@/shared/ui/complex/BrowserEmptyState";
import { UserCircle } from "lucide-react";

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
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const {
    processedAgents,
    viewMode,
    setViewMode,
    selectedAgentId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig,
  } = useAgentsBrowser(initialAgents);

  const { deleteWithUndo } = useDeleteWithUndo();
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

  const { draft, clearDraft } = useAgentDraft(workspaceId);
  const [isDraftSelected, setIsDraftSelected] = React.useState(false);

  const [agentToDeleteId, setAgentToDeleteId] = React.useState<string | null>(null);
  const { mutate: deleteAgent } = useDeleteAgent();
  const { data: affectedCrews = [], isLoading: isInspectionLoading } = useInspectAgentDeletion(agentToDeleteId);

  const handleDeleteClick = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
      }
      return;
    }
    
    const agent = initialAgents.find(a => a.id === id);
    const name = agent?.agent_name || agent?.agent_role_text || "Agent";
    deleteWithUndo(id, name, () => deleteAgent(id));
  };

  const confirmDelete = () => {
    if (agentToDeleteId) {
      deleteAgent(agentToDeleteId);
      setAgentToDeleteId(null);
    }
  };

  const selectedAgent = initialAgents.find(a => a.id === selectedAgentId) || null;
  const agentToDelete = initialAgents.find(a => a.id === agentToDeleteId);

  // Map draft to Agent structure for peek
  const draftAgent = React.useMemo(() => {
    if (!draft) return null;
    return {
      id: "draft",
      agent_name: draft.agent_name || "New Agent",
      agent_role_text: draft.agent_role_text || "Draft Agent",
      agent_goal: draft.agent_goal || "Work in progress...",
      agent_backstory: draft.agent_backstory || "",
      agent_keywords: draft.agent_keywords || [],
      agent_visual_url: draft.agent_visual_url || null,
      llm_model_id: draft.llm_model_id || null,
      knowledge_hub_ids: draft.knowledge_hub_ids || [],
      availability_workspace: [workspaceId],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  }, [draft, workspaceId]);

  const activeAgent = isDraftSelected ? draftAgent : (selectedAgent || null);

  const displayAgents = React.useMemo(() => {
    const limit = draft ? 3 : 4;
    return processedAgents.slice(0, limit);
  }, [processedAgents, draft]);

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
            { label: "Role", groupId: 'roles' }
          ]}
          onToggleFilter={handleToggleFilter}
          onApplyFilters={handleApplyFilters}
          onClearAllFilters={handleClearAll}
          onPendingFilterIdsChange={setPendingFilterIds}
          resultsCount={getPreviewCount(initialAgents) + (draft ? 1 : 0)}
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
    >
      {displayAgents.length === 0 && !draft ? (
        <BrowserEmptyState
            message={initialAgents.length === 0 ? "No agents defined yet. Bring in some talent." : "No agents found matching your criteria."}
            buttonLabel="Add Agent"
            onAdd={() => router.push(`/workspaces/${workspaceId}/agents/studio`)}
        />
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-8"}>
          {/* Render Draft Card if exists and no search query or matches search */}
          {draft && (!searchQuery || draft.agent_name?.toLowerCase().includes(searchQuery.toLowerCase())) && (
            <WorkspaceCard 
                key="agent-draft"
                variant="agent"
                isDraft
                layout={viewMode}
                title={draft.agent_name || "New Agent"}
                description={draft.agent_goal || "Resume creating this agent..."}
                href="#"
                badgeLabel={draft.agent_role_text || "Draft Agent"}
                tags={draft.agent_keywords}
                resourceId="draft"
                onEdit={() => {
                    setIsDraftSelected(true);
                    setIsSidebarOpen(true);
                }}
                onClick={() => {
                    setIsDraftSelected(true);
                    setIsSidebarOpen(true);
                }}
                onDelete={() => handleDeleteClick("draft")}
                colorName="default"
                className="w-full"
                visualArea={
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center overflow-hidden bg-zinc-900/50 group-hover:bg-zinc-900/40 transition-colors",
                        viewMode === "grid" ? "pt-0" : "pt-0"
                    )}>
                        <UserCircle className={cn(
                            "text-zinc-800 transition-all duration-500",
                            viewMode === "grid" ? "w-24 h-24" : "w-12 h-12"
                        )} />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-500/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                }
            />
          )}

          {displayAgents.map((agent, index) => {
            const avatarUrl = getAgentAvatarUrl(agent.id, agent.agent_visual_url);
            
            return (
              <WorkspaceCard 
                  key={agent.id}
                  variant="agent"
                  layout={viewMode}
                  title={agent.agent_role_text || agent.agent_name || "Agent Person"}
                  description={agent.agent_goal}
                  href="#"
                  badgeLabel={agent.agent_role_text || "AI Agent"}
                  tags={agent.agent_keywords}
                  resourceId={agent.id}
                  onEdit={() => {
                      setIsDraftSelected(false);
                      handleViewDetails(agent.id);
                  }}
                  onClick={() => {
                      setIsDraftSelected(false);
                      handleViewDetails(agent.id);
                  }}
                  onDelete={handleDeleteClick}
                  colorName={colorName}
                  className="w-full"
                  visualArea={
                      <div className={cn(
                          "absolute inset-0 flex items-start justify-center overflow-hidden",
                          viewMode === "grid" ? "pt-24" : "pt-0"
                      )}>
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                          
                          <div className="relative w-full h-full flex justify-center">
                              <Image 
                                  src={avatarUrl}
                                  alt={agent.agent_name || "Agent"}
                                  fill
                                  sizes={viewMode === "grid" ? "(max-width: 768px) 100vw, 252px" : "140px"}
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
        agent={activeAgent}
        isOpen={isSidebarOpen}
        onClose={() => {
            setIsDraftSelected(false);
            setIsSidebarOpen(false);
        }}
        onDelete={handleDeleteClick}
        onEdit={() => {
            if (isDraftSelected) {
                router.push(`/workspaces/${workspaceId}/agents/studio`);
            } else if (selectedAgentId) {
                router.push(`/workspaces/${workspaceId}/agents/studio/${selectedAgentId}`);
            }
        }}
      />

      <DestructiveDeleteModal
        isOpen={!!agentToDeleteId}
        onClose={() => setAgentToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Agent Deletion"
        resourceName={agentToDelete?.agent_name || "this agent"}
        affectedResources={affectedCrews}
        isLoading={isInspectionLoading}
      />
    </BrowserLayout>
  );
};
