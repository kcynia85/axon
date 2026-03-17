"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAgentsSection } from "../application/useAgentsSection";
import { useDeleteAgent, useInspectAgentDeletion } from "@/modules/agents/infrastructure/useAgents";
import { useAgentDraft } from "@/modules/agents/application/useAgentDraft";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import { AgentProfilePeek } from "./AgentProfilePeek";
import { getAgentAvatarUrl } from "@/shared/lib/utils";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { UserCircle } from "lucide-react";

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
    setAgentToDeleteId(id);
  };

  const confirmDelete = () => {
    if (agentToDeleteId) {
      deleteAgent(agentToDeleteId);
      setAgentToDeleteId(null);
    }
  };

  const agentToDelete = agents?.find(a => a.id === agentToDeleteId);

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

  if (isAgentsLoading) {
    return (
      <div className="flex flex-wrap gap-6">
        {[1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="aspect-[1694/2528] w-[252px] shadow-sm rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-6">
        {/* Render Draft if exists */}
        {draft && (
          <WorkspaceCard
            key="agent-draft"
            variant="agent"
            isDraft
            title={draft.agent_name || "New Agent"}
            description={draft.agent_goal || "Resume creating this agent..."}
            href={`/workspaces/${workspaceId}/agents/studio`}
            badgeLabel={draft.agent_role_text || "Draft Agent"}
            tags={draft.agent_keywords}
            className="w-[252px] shrink-0"
            colorName="default"
            onEdit={() => setIsDraftSelected(true)}
            onDelete={() => handleDeleteClick("draft")}
            resourceId="draft"
            visualArea={
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-zinc-900/50 group-hover:bg-zinc-900/40 transition-colors">
                <UserCircle className="w-24 h-24 text-zinc-800" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-500/10 via-transparent to-transparent pointer-events-none" />
              </div>
            }
          />
        )}

        {agents.map((agent) => {
          const avatarUrl = getAgentAvatarUrl(agent.id, agent.agent_visual_url);

          return (
            <WorkspaceCard
              key={agent.id}
              variant="agent"
              title={agent.agent_role_text || agent.agent_name || "Agent Person"}
              description={agent.agent_goal}
              href={`/workspaces/${workspaceId}/agents/${agent.id}`}
              badgeLabel={agent.agent_role_text || "AI Agent"}
              tags={agent.agent_keywords}
              resourceId={agent.id}
              onEdit={() => {
                setIsDraftSelected(false);
                handleSelectAgent(agent.id);
              }}
              onDelete={handleDeleteClick}
              className="w-[252px] shrink-0"
              colorName={colorName}
              visualArea={
                <div className="absolute inset-0 flex items-start justify-center overflow-hidden pt-24">
                  {/* Background Soft Glow (Consistent neutral black for all workspaces) */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Optimized Agent Image using Next.js Image component */}
                  <div className="relative w-full h-full flex justify-center">
                    <Image
                      src={avatarUrl}
                      alt={agent.agent_name || "Agent"}
                      fill
                      sizes="252px"
                      priority
                      className="object-contain scale-[1.25] origin-bottom transition-all duration-500 group-hover:-translate-y-2"
                    />
                  </div>
                </div>
              }
            />
          );
        })}

        {!draft && (!agents || agents.length === 0) && (
          <Card className="border-dashed h-24 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5 w-full">
            No agents defined yet. Bring in some talent.
          </Card>
        )}
      </div>

      <AgentProfilePeek 
        agent={activeAgent}
        isOpen={!!activeAgent}
        onClose={() => {
          setIsDraftSelected(false);
          handleClosePeek();
        }}
        onDelete={handleDeleteClick}
        onEdit={() => {
          if (isDraftSelected) {
            router.push(`/workspaces/${workspaceId}/agents/studio`);
          } else if (selectedAgent) {
            router.push(`/workspaces/${workspaceId}/agents/studio/${selectedAgent.id}`);
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
    </>
  );
};
