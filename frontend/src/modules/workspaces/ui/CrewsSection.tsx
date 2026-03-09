"use client";

import * as React from "react";
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

  // Map agent IDs to their visual URLs for better visual representation in cards
  const agentVisualsMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    agents?.forEach(agent => {
      if (agent.agent_visual_url) {
        map[agent.id] = agent.agent_visual_url;
      }
    });
    return map;
  }, [agents]);

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
        onEdit={() => {}} // TODO: Handle edit
      />
    </>
  );
};
