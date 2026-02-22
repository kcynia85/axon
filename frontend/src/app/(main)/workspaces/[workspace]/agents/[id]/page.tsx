"use client";

import { useParams, useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Separator } from "@/shared/ui/ui/Separator";
import { useAgents } from "@/modules/workspaces/application/useWorkspaces";
import { Info, Brain, Zap, Shield, Users } from "lucide-react";

export default function AgentSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const agentId = params.id as string;
  
  const { data: agents } = useAgents(workspaceId);
    const agent = agents?.find((agentItem) => agentItem.id === agentId);

  if (!agent) return null;

  return (
    <SidePeek 
        title={agent.role} 
        subtitle="Agent Profile"
        footer={
            <Button className="w-full" variant="outline" onClick={() => router.push(`/workspaces/${workspaceId}/agents/${agentId}/edit`)}>
                Edytuj Agenta
            </Button>
        }
    >
        <div className="space-y-8">
            {/* Stats / Metadata */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold">Cost</div>
                    <div className="text-sm font-medium">$0.00</div>
                </div>
                <div className="space-y-1">
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold">Model LLM</div>
                    <div className="text-sm font-medium">Gemini 2.5 Pro</div>
                </div>
            </div>

            {/* Keywords */}
            <section className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                        {agent.keywords?.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="font-normal">#{keyword}</Badge>
                        ))}
                </div>
            </section>

            <Separator />

            {/* Identity & Context */}
            <section className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" /> Goal
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {agent.goal}
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" /> Backstory (RAG)
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-dashed">
                        {agent.backstory || "No backstory defined."}
                    </p>
                </div>
            </section>

            <Separator />

            {/* Skills & Behaviour */}
            <section className="space-y-4">
                 <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" /> Skills
                </h3>
                <ul className="space-y-2 text-xs">
                    <li className="flex items-center justify-between p-2 bg-muted/50 rounded border">
                        <span>Web Search</span>
                        <Badge variant="outline" className="text-[10px]">Native</Badge>
                    </li>
                    <li className="flex items-center justify-between p-2 bg-muted/50 rounded border">
                        <span>File Browser</span>
                        <Badge variant="outline" className="text-[10px]">Native</Badge>
                    </li>
                </ul>
            </section>

            {/* Availability */}
            <section className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Dostępność
                </h3>
                <div className="flex gap-2">
                    <Badge variant="outline">Global</Badge>
                    <Badge variant="outline">Product Management</Badge>
                </div>
            </section>
        </div>
    </SidePeek>
  );
}
