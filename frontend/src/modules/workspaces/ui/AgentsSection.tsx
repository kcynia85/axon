"use client";

import * as React from "react";
import { useAgentsSection } from "../application/useAgents-section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "./SidePeek";
import { CostEstimator } from "./CostEstimator";
import { Button } from "@/shared/ui/ui/Button";
import { Edit2, Layout, Zap, Trash2 } from "lucide-react";

interface AgentsSectionProps {
  workspaceId: string;
}

export const AgentsSection = ({ workspaceId }: AgentsSectionProps) => {
  const {
    agents,
    isAgentsLoading,
    selectedAgent,
    costEstimate,
    isCostLoading,
    handleSelectAgent,
    handleClosePeek,
  } = useAgentsSection(workspaceId);

  if (isAgentsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full" />)}
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic">
        No agents defined yet. Bring in some talent.
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className="hover:border-primary/50 transition-all cursor-pointer group relative hover:shadow-lg dark:hover:shadow-primary/5"
            onClick={() => handleSelectAgent(agent.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold">
                  {agent.agent_role_text || "Specialist"}
                </Badge>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-sm font-bold mt-2 font-display">
                {agent.agent_name || "Untitled Agent"}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-[11px] leading-relaxed">
                {agent.agent_goal || "No goal defined"}
              </CardDescription>

              <div className="flex items-center gap-1 mt-3 flex-wrap">
                {agent.agent_keywords?.slice(0, 2).map((kw, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground/60 italic">#{kw}</span>
                ))}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <SidePeek
        open={!!selectedAgent}
        onOpenChange={(open) => !open && handleClosePeek()}
        title={selectedAgent?.agent_name || "Agent Details"}
        description={selectedAgent?.agent_role_text || "Specialist"}
      >
        {selectedAgent && (
          <div className="space-y-8">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Layout className="w-3 h-3" /> Core Goal
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 p-4 rounded-lg border border-primary/5">
                {selectedAgent.agent_goal}
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Zap className="w-3 h-3" /> Economics
              </h4>
              {isCostLoading || !costEstimate ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <CostEstimator estimate={costEstimate} />
              )}
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Edit Configuration
              </Button>
              <Button variant="outline" className="flex-1">
                Open Lab
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SidePeek>
    </>
  );
};
