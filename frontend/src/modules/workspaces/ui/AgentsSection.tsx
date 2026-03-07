"use client";

import * as React from "react";
import Image from "next/image";
import { useAgentsSection } from "../application/useAgentsSection";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import { AgentProfilePeek } from "./AgentProfilePeek";
import { AGENT_REAL_NAMES } from "../domain/constants";

const getDeterministicImgId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return (Math.abs(hash) % 5) + 1;
};

type AgentsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const AgentsSection = ({ workspaceId, colorName = "default" }: AgentsSectionProps) => {
  const {
    agents,
    isAgentsLoading,
    selectedAgent,
    handleSelectAgent,
    handleClosePeek,
  } = useAgentsSection(workspaceId);

  if (isAgentsLoading) {
    return (
      <div className="flex flex-wrap gap-6">
        {[1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="aspect-[1694/2528] w-[252px] shadow-sm rounded-xl" />
        ))}
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <Card className="border-dashed h-24 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No agents defined yet. Bring in some talent.
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-6">
        {agents.map((agent) => {
          const imgId = getDeterministicImgId(agent.id);

          return (
            <WorkspaceCard
              key={agent.id}
              variant="agent"
              title={AGENT_REAL_NAMES[agent.id] || agent.agent_name || "Agent Person"}
              description={agent.agent_goal}
              href={`/workspaces/${workspaceId}/agents/${agent.id}`}
              badgeLabel={agent.agent_role_text || "AI Agent"}
              tags={agent.agent_keywords}
              onEdit={() => handleSelectAgent(agent.id)}
              className="w-[252px] shrink-0"
              colorName={colorName}
              visualArea={
                <div className="absolute inset-0 flex items-start justify-center overflow-hidden pt-24">
                  {/* Background Soft Glow (Consistent neutral black for all workspaces) */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Optimized Agent Image using Next.js Image component */}
                  <div className="relative w-full h-full flex justify-center">
                    <Image
                      src={`/images/avatars/agent-${imgId}.png`}
                      alt={agent.agent_name}
                      fill
                      sizes="252px"
                      priority={imgId <= 2}
                      className="object-contain scale-[1.25] origin-bottom transition-all duration-500 group-hover:-translate-y-2"
                    />
                  </div>
                </div>
              }
            />
          );
        })}
      </div>

      <AgentProfilePeek 
        agent={selectedAgent}
        isOpen={!!selectedAgent}
        onClose={handleClosePeek}
        onEdit={() => {}} // TODO: Handle edit
      />
    </>
  );
};
