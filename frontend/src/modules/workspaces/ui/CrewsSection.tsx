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
import { Workflow, Users } from "lucide-react";

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
  
  const [selectedCrewId, setSelectedCrewId] = React.useState<string | null>(null);
  const [isDraftSelected, setIsDraftSelected] = React.useState(false);

  const handleDelete = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
      }
      return;
    }
    if (window.confirm("Are you sure you want to delete this crew?")) {
      deleteCrew(id);
    }
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

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Render Draft if exists */}
        {draft && (
          <WorkspaceCardHorizontal 
            key="crew-draft"
            variant="crew"
            isDraft
            icon={Users}
            title={draft.crew_name || "New Team"}
            description={draft.crew_description || "Resume assembling this crew..."}
            href={`/workspaces/${workspaceId}/crews/studio`}
            badgeLabel={draft.crew_process_type || "Draft Team"}
            tags={draft.crew_keywords}
            resourceId="draft"
            onEdit={() => setIsDraftSelected(true)}
            onDelete={() => handleDelete("draft")}
            colorName="default"
            agentIds={[]}
            agentVisualsMap={{}}
            footerContent={
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <Workflow className="w-3 h-3 text-zinc-500" />
                    <span>{(draft.agent_member_ids || []).length} Potential Nodes</span>
                </div>
            }
          />
        )}

        {crews?.map((crew) => (
          <WorkspaceCardHorizontal 
            key={crew.id}
            variant="crew"
            title={crew.crew_name}
            description={crew.crew_description}
            href={`/workspaces/${workspaceId}/crews/${crew.id}`}
            badgeLabel={crew.crew_process_type}
            tags={crew.crew_keywords}
            resourceId={crew.id}
            onEdit={() => {
              setIsDraftSelected(false);
              setSelectedCrewId(crew.id);
            }}
            onDelete={handleDelete}
            colorName={colorName}
            agentIds={crew.agent_member_ids}
            agentVisualsMap={agentVisualsMap}
          />
        ))}

        {!draft && (!crews || crews.length === 0) && (
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
    </>
  );
};
