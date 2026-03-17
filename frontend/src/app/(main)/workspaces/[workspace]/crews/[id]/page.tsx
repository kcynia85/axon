"use client";

import { useParams, useRouter } from "next/navigation";
import { useCrews, useAgents } from "@/modules/workspaces/application/useWorkspaces";
import { CrewProfilePeek } from "@/modules/workspaces/ui/CrewProfilePeek";
import { useMemo } from "react";

export default function CrewSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const crewId = params.id as string;

  const { data: crews } = useCrews(workspaceId);
  const { data: agents } = useAgents(workspaceId);

  const crew = crews?.find((crewItem) => crewItem.id === crewId) || null;

  const agentsMap = useMemo(() => {
    if (!agents) return {};
    return agents.reduce((acc, agent) => {
      acc[agent.id] = {
        name: agent.agent_role_text || agent.agent_name || "Specialist Agent",
        visualUrl: agent.agent_visual_url
      };
      return acc;
    }, {} as Record<string, { name: string; visualUrl?: string | null }>);
  }, [agents]);


  if (!crew) return null;

  return (
    <CrewProfilePeek
      crew={crew}
      isOpen={true}
      onClose={() => router.push(`/workspaces/${workspaceId}/crews`)}
      onEdit={() => router.push(`/workspaces/${workspaceId}/crews/studio/${crewId}`)}
      agentsMap={agentsMap}
    />
  );
}

