"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAgentsSection } from "../application/useAgentsSection";
import { useDeleteAgent } from "@/modules/agents/infrastructure/useAgents";
import { useAgentDraft } from "@/modules/agents/application/useAgentDraft";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { AgentsSectionView } from "./AgentsSectionView";

type AgentsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const AgentsSection = ({ workspaceId, colorName = "default" }: AgentsSectionProps) => {
  const router = useRouter();
  const {
    agents,
    isAgentsLoading,
    selectedAgent,
    handleSelectAgent,
    handleClosePeek,
  } = useAgentsSection(workspaceId);

  const { deleteWithUndo } = useDeleteWithUndo();
  const { draft, clearDraft } = useAgentDraft(workspaceId);
  const [isDraftSelected, setIsDraftSelected] = React.useState(false);
  const [agentToDeleteId, setAgentToDeleteId] = React.useState<string | null>(null);

  const { mutate: deleteAgent } = useDeleteAgent();

  const handleDeleteClick = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
      }
      return;
    }
    
    setAgentToDeleteId(id);
  };

  const confirmDelete = () => {
    if (!agentToDeleteId) return;
    
    const agent = agents?.find(a => a.id === agentToDeleteId);
    const name = agent?.agent_name || agent?.agent_role_text || "Agent";
    deleteWithUndo(agentToDeleteId, name, () => deleteAgent(agentToDeleteId));
    setAgentToDeleteId(null);
  };

  // Derived state - React Compiler handles optimization
  const draftAgent = draft ? {
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
  } : null;

  const activeAgent = isDraftSelected ? draftAgent : (selectedAgent || null);

  const handleSelect = (id: string) => {
    setIsDraftSelected(false);
    handleSelectAgent(id);
  };

  const handleEdit = (id?: string) => {
    if (!id || id === "draft") {
      router.push(`/workspaces/${workspaceId}/agents/studio`);
    } else {
      router.push(`/workspaces/${workspaceId}/agents/studio/${id}`);
    }
  };

  const handleAdd = () => {
    router.push(`/workspaces/${workspaceId}/agents/studio`);
  };

  return (
    <AgentsSectionView 
        workspaceId={workspaceId}
        agents={agents}
        isAgentsLoading={isAgentsLoading}
        activeAgent={activeAgent}
        agentToDeleteId={agentToDeleteId}
        colorName={colorName}
        onSelectAgent={handleSelect}
        onClosePeek={() => {
            setIsDraftSelected(false);
            handleClosePeek();
        }}
        onDeleteClick={handleDeleteClick}
        onConfirmDelete={confirmDelete}
        onCancelDelete={() => setAgentToDeleteId(null)}
        onEditAgent={handleEdit}
        onAddAgent={handleAdd}
    />
  );
};
