"use client";

import { useAgents } from "../application/use-workspaces";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import Link from "next/link";

interface AgentsSectionProps {
  workspaceId: string;
}

export const AgentsSection = ({ workspaceId }: AgentsSectionProps) => {
  const { data: agents, isLoading } = useAgents(workspaceId);

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (!agents || agents.length === 0) {
    return <div className="p-4 border rounded-md text-muted-foreground text-sm">No agents defined yet.</div>;
  }

  // Display only first 3 in overview as per axon_bb_workspaces
  const previewAgents = agents.slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {previewAgents.map((agent) => (
        <Link key={agent.id} href={`/workspaces/${workspaceId}/agents/${agent.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-semibold">{agent.role}</CardTitle>
                    <div className="text-[10px] text-muted-foreground">Active</div>
                </div>
                <CardDescription className="line-clamp-2 text-xs">{agent.goal}</CardDescription>
                {agent.keywords && agent.keywords.length > 0 && (
                    <div className="mt-2 text-[10px] text-muted-foreground italic">
                        #{agent.keywords[0]}
                    </div>
                )}
            </CardHeader>
            </Card>
        </Link>
      ))}
    </div>
  );
};
