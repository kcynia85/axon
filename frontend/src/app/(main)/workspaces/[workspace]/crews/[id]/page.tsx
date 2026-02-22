"use client";

import { useParams, useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Separator } from "@/shared/ui/ui/Separator";
import { useCrews, useAgents } from "@/modules/workspaces/application/useWorkspaces";
import { Users, Info, Box, LayoutPanelLeft } from "lucide-react";

export default function CrewSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const crewId = params.id as string;
  
  const { data: crews } = useCrews(workspaceId);
  const { data: agents } = useAgents(workspaceId);
    const crew = crews?.find((crewItem) => crewItem.id === crewId);

  if (!crew) return null;

    const crewAgents = agents?.filter((agentItem) => crew.agents.includes(agentItem.id)) || [];

  return (
    <SidePeek 
        title={crew.name} 
        subtitle="Crew Details"
        footer={
            <Button className="w-full" variant="outline" onClick={() => router.push(`/workspaces/${workspaceId}/crews/${crewId}/edit`)}>
                Edit Crew
            </Button>
        }
    >
        <div className="space-y-8">
            {/* Identity */}
            <section className="space-y-3">
                <h3 className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-2">
                    <Info className="h-3 w-3" /> Basic Info
                </h3>
                <div className="space-y-1">
                    <div className="text-sm font-medium">Process Type</div>
                    <Badge variant="secondary" className="capitalize">{crew.process}</Badge>
                </div>
            </section>

            <Separator />

            {/* Team Members */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Team Members
                </h3>
                <div className="space-y-2">
                    {crewAgents.map(agent => (
                        <div key={agent.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-dashed text-xs">
                            <div className="font-medium">{agent.role}</div>
                            <Badge variant="outline" className="text-[10px]">Active</Badge>
                        </div>
                    ))}
                    {crewAgents.length === 0 && (
                        <div className="text-xs text-muted-foreground italic">No agents assigned.</div>
                    )}
                </div>
            </section>

            <Separator />

            {/* Context & Artefacts (Placeholders as per breadboard) */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <LayoutPanelLeft className="h-4 w-4 text-primary" /> Context
                </h3>
                <div className="text-xs text-muted-foreground p-3 border rounded bg-muted/20">
                    competitors_list.md
                </div>

                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Box className="h-4 w-4 text-primary" /> Artefact
                </h3>
                <div className="text-xs text-muted-foreground p-3 border rounded bg-muted/20">
                    synteza.md
                </div>
            </section>
        </div>
    </SidePeek>
  );
}
