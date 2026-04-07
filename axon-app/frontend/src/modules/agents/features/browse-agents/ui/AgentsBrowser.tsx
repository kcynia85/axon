"use client";

import React from "react";
import { useAgentsBrowser } from "../application/useAgentsBrowser";
import { Agent } from "@/shared/domain/workspaces";
import { useParams, useRouter } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { useDeleteAgent, useInspectAgentDeletion } from "@/modules/agents/infrastructure/useAgents";
import { useAgentDraft } from "@/modules/agents/application/useAgentDraft";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { AgentsBrowserView } from "./AgentsBrowserView";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Added" },
];

type AgentsBrowserProps = {
  readonly initialAgents: Agent[];
  readonly colorName?: string;
}

/**
 * AgentsBrowser: Container component for managing the agents inventory.
 * Standard: Container pattern, 0% UI declaration.
 */
export const AgentsBrowser = ({ initialAgents, colorName = "default" }: AgentsBrowserProps) => {
  const parameters = useParams();
  const router = useRouter();
  const workspaceId = parameters.workspace as string;

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

  const handleDeleteAgent = (agentId: string) => {
    if (agentId === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
      }
      return;
    }
    
    const agent = initialAgents.find(agentItem => agentItem.id === agentId);
    const name = agent?.agent_name || agent?.agent_role_text || "Agent";
    deleteWithUndo(agentId, name, () => deleteAgent(agentId));
  };

  const confirmDelete = () => {
    if (agentToDeleteId) {
      deleteAgent(agentToDeleteId);
      setAgentToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setAgentToDeleteId(null);
  };

  const handleEditAgent = (agent: Agent) => {
    if (agent.id === "draft") {
      router.push(`/workspaces/${workspaceId}/agents/studio`);
    } else {
      router.push(`/workspaces/${workspaceId}/agents/studio/${agent.id}`);
    }
  };

  const handleViewAgentDetails = (agentId: string) => {
    setIsDraftSelected(agentId === "draft");
    handleViewDetails(agentId);
  };

  // Logic previously in useMemo, now handled directly (React Compiler will optimize)
  const getDraftAgent = (): Agent | null => {
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
      native_skills: draft.native_skills || [],
      custom_functions: draft.custom_functions || [],
      data_interface: draft.data_interface || { context: [], artefacts: [] },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Agent;
  };

  const draftAgent = getDraftAgent();
  const selectedAgent = initialAgents.find(agentItem => agentItem.id === selectedAgentId) || null;
  const activeAgent = isDraftSelected ? draftAgent : selectedAgent;
  const agentToDelete = initialAgents.find(agentItem => agentItem.id === agentToDeleteId) || null;

  return (
    <AgentsBrowserView
      processedAgents={processedAgents}
      draftAgent={draftAgent}
      viewMode={viewMode}
      setViewMode={setViewMode}
      colorName={colorName}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortBy={sortBy}
      onSortChange={setSortBy}
      sortOptions={SORT_OPTIONS}
      activeFilters={activeFilters}
      filterGroups={filterGroups}
      onToggleFilter={handleToggleFilter}
      onRemoveFilter={(filterItem) => handleRemoveFilter(filterItem.id)}
      onClearAllFilters={handleClearAll}
      onApplyFilters={handleApplyFilters}
      onPendingFilterIdsChange={(idsSet) => setPendingFilterIds(Array.from(idsSet))}
      resultsCount={getPreviewCount(initialAgents) + (draft ? 1 : 0)}
      isSidebarOpen={isSidebarOpen}
      onCloseSidebar={() => {
        setIsDraftSelected(false);
        setIsSidebarOpen(false);
      }}
      activeAgent={activeAgent}
      onEditAgent={handleEditAgent}
      onDeleteAgent={handleDeleteAgent}
      onViewDetails={handleViewAgentDetails}
      agentToDelete={agentToDelete}
      affectedResources={affectedCrews}
      isInspectionLoading={isInspectionLoading}
      onConfirmDelete={confirmDelete}
      onCancelDelete={cancelDelete}
    />
  );
};
