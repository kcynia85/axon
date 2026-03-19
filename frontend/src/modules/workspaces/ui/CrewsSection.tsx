"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCrews, useDeleteCrew } from "../application/useCrews";
import { useAgents } from "@/modules/agents/infrastructure/useAgents";
import { useCrewDraft } from "@/modules/studio/features/crew-studio/application/useCrewDraft";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { CrewProfilePeek } from "./CrewProfilePeek";
import { getAgentAvatarUrl } from "@/shared/lib/utils";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { toast } from "sonner";

type CrewsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const CrewsSection = ({ workspaceId, colorName = "default" }: CrewsSectionProps) => {
  const router = useRouter();
  const { data: crews, isLoading: isCrewsLoading } = useCrews(workspaceId);
  const { mutate: deleteCrew } = useDeleteCrew(workspaceId);
  const { data: agents } = useAgents(workspaceId);
  const { draft, clearDraft } = useCrewDraft(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  
  const [selectedCrewId, setSelectedCrewId] = React.useState<string | null>(null);
  const [isDraftSelected, setIsDraftSelected] = React.useState(false);
  const [crewToDeleteId, setCrewToDeleteId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
        toast.success("Szkic zespołu usunięty");
      }
      return;
    }
    
    setCrewToDeleteId(id);
  };

  const confirmDelete = () => {
    if (!crewToDeleteId) return;
    
    const crew = crews?.find(c => c.id === crewToDeleteId);
    const name = crew?.crew_name || "Crew";
    deleteWithUndo(crewToDeleteId, name, () => deleteCrew(crewToDeleteId));
    setCrewToDeleteId(null);
  };

  if (isCrewsLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />
        ))}
      </div>
    );
  }

  // Map agent IDs to their info for better visual representation in cards and peek
  const agentsMap = React.useMemo(() => {
    const map: Record<string, { name: string; visualUrl?: string | null }> = {};

    // Strictly use real data from API
    agents?.forEach(agent => {
      map[agent.id] = {
        name: agent.agent_role_text || agent.agent_name || "Specialist Agent",
        visualUrl: agent.agent_visual_url
      };
    });
    return map;
  }, [agents]);

  // Compatibility map for WorkspaceCardHorizontal
  const agentVisualsMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(agentsMap).forEach(([id, info]) => {
      map[id] = getAgentAvatarUrl(id, info.visualUrl);
    });
    return map;
  }, [agentsMap]);

  // Map draft to Crew structure for peek
  const draftCrew = React.useMemo(() => {
    if (!draft) return null;
    return {
      id: "draft",
      crew_name: draft.crew_name || "New Team",
      crew_description: draft.crew_description || "Work in progress...",
      crew_process_type: draft.crew_process_type || "Hierarchical",
      crew_keywords: draft.crew_keywords || [],
      agent_member_ids: draft.agent_member_ids || [],
      manager_agent_id: draft.owner_agent_id || null,
      availability_workspace: [workspaceId],
      data_interface: {
        context: draft.contexts || [],
        artefacts: draft.artefacts || []
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  }, [draft, workspaceId]);

  const activeCrew = isDraftSelected ? draftCrew : (crews?.find((crewItem) => crewItem.id === selectedCrewId) || null);

  const displayCrews = React.useMemo(() => {
    if (!crews) return [];
    return crews.slice(0, 4);
  }, [crews]);

  return (
    <>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {displayCrews.map((crew) => (
          <WorkspaceCardHorizontal 
            key={crew.id}
            variant="crew"
            title={crew.crew_name}
            description={crew.crew_description}
            href="#"
            tags={crew.crew_keywords}
            resourceId={crew.id}
            onEdit={() => {
              router.push(`/workspaces/${workspaceId}/crews/studio/${crew.id}`);
            }}
            onClick={() => {
              setIsDraftSelected(false);
              setSelectedCrewId(crew.id);
            }}
            onDelete={handleDelete}
            colorName={colorName}
            agentIds={crew.agent_member_ids}
            agentVisualsMap={agentVisualsMap}
          />
        ))}

        {(!crews || crews.length === 0) && (
          <Card className="border-dashed h-32 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5 col-span-full">
            No crews assembled. Strategy requires team effort.
          </Card>
        )}
      </div>

      <CrewProfilePeek 
        crew={activeCrew}
        isOpen={isDraftSelected || !!selectedCrewId}
        onClose={() => {
          setIsDraftSelected(false);
          setSelectedCrewId(null);
        }}
        agentsMap={agentsMap}
        onDelete={handleDelete}
        onEdit={() => {
          if (isDraftSelected) {
            router.push(`/workspaces/${workspaceId}/crews/studio`);
          } else if (selectedCrewId) {
            router.push(`/workspaces/${workspaceId}/crews/studio/${selectedCrewId}`);
          }
        }}
      />

      <DestructiveDeleteModal
        isOpen={!!crewToDeleteId}
        onClose={() => setCrewToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Crew"
        resourceName={crews?.find(c => c.id === crewToDeleteId)?.crew_name || "Crew"}
        affectedResources={[]}
      />
    </>
  );
};
