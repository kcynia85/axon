"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCrews } from "../application/useCrews";
import { useAgents } from "@/modules/agents/infrastructure/useAgents";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { CrewProfilePeek } from "./CrewProfilePeek";

type CrewsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const CrewsSection = ({ workspaceId, colorName = "default" }: CrewsSectionProps) => {
  const router = useRouter();
  const { data: crews, isLoading: isCrewsLoading } = useCrews(workspaceId);
  const { data: agents } = useAgents(workspaceId);
  const [selectedCrewId, setSelectedCrewId] = React.useState<string | null>(null);

  if (isCrewsLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />
        ))}
      </div>
    );
  }

  if (!crews || crews.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No crews assembled. Strategy requires team effort.
      </Card>
    );
  }

  // Map agent IDs to their info for better visual representation in cards and peek
  const agentsMap = React.useMemo(() => {
    // 1. Start with hardcoded fallbacks for mock UUIDs used in development
    const map: Record<string, { name: string; visualUrl?: string | null }> = {
      "00000000-0000-0000-0000-000000000001": { name: "Product Owner", visualUrl: "/images/avatars/agent-1.png" },
      "00000000-0000-0000-0000-000000000002": { name: "Technical Writer", visualUrl: "/images/avatars/agent-2.png" },
      "00000000-0000-0000-0000-000000000003": { name: "User Researcher", visualUrl: "/images/avatars/agent-3.png" },
      "00000000-0000-0000-0000-000000000004": { name: "Full-Stack Developer", visualUrl: "/images/avatars/agent-4.png" },
    };

    // 2. Override/Supplement with real data from API
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
      if (info.visualUrl) map[id] = info.visualUrl;
    });
    return map;
  }, [agentsMap]);

  const selectedCrew = crews.find((crewItem) => crewItem.id === selectedCrewId) || null;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {crews.map((crew) => (
          <WorkspaceCardHorizontal 
            key={crew.id}
            variant="crew"
            title={crew.crew_name}
            description={crew.crew_description}
            href={`/workspaces/${workspaceId}/crews/${crew.id}`}
            badgeLabel={crew.crew_process_type}
            tags={crew.crew_keywords}
            onEdit={() => setSelectedCrewId(crew.id)}
            colorName={colorName}
            agentIds={crew.agent_member_ids}
            agentVisualsMap={agentVisualsMap}
          />
        ))}
      </div>

      <CrewProfilePeek 
        crew={selectedCrew}
        isOpen={!!selectedCrewId}
        onClose={() => setSelectedCrewId(null)}
        agentsMap={agentsMap}
        onEdit={() => {
          if (selectedCrewId) {
            router.push(`/workspaces/${workspaceId}/crews/studio/${selectedCrewId}`);
          }
        }}
      />
    </>
  );
};
