"use client";

import * as React from "react";
import { useCrews } from "../application/useCrews";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  Users,
  Workflow,
  Shield,
  Trash2,
  Edit2,
  Hash,
  FileText,
  Globe,
  UserPlus,
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";

/** Human-friendly names for Agents */
const AGENT_NAMES: Record<string, string> = {
  "a-product-owner": "Product Owner",
  "a-tech-writer": "Technical Writer",
  "a-user-researcher": "User Researcher",
  "a-competitor-analyst": "Competitive Analyst",
  "a-ui-designer": "UI Designer",
  "a-developer": "Full-Stack Developer",
  "a-qa-engineer": "QA Engineer",
  "a-copywriter": "Copywriter",
};

type CrewsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
}

export const CrewsSection = ({ workspaceId, colorName = "default" }: CrewsSectionProps) => {
  const { data: crews, isLoading } = useCrews(workspaceId);
  const [selectedCrewId, setSelectedCrewId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
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

  const selectedCrew = crews.find((crewItem) => crewItem.id === selectedCrewId);

  const getInitials = (id: string) => {
    const name = AGENT_NAMES[id] || "Agent";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  };

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
            footerContent={
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <Workflow className="w-3 h-3" />
                    <span>{crew.agent_member_ids.length} Nodes</span>
                </div>
            }
          />
        ))}
      </div>

      <SidePeek
        open={!!selectedCrewId}
        onOpenChange={(open) => !open && setSelectedCrewId(null)}
        title={selectedCrew?.crew_name || "Crew Details"}
        description={`${selectedCrew?.crew_process_type} Process Unit`}
      >
        {selectedCrew && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Workflow className="w-3 h-3" /> Mission Protocol
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 p-4 rounded-lg border border-primary/5">
                {selectedCrew.crew_description || "This crew follows a tactical process to achieve its goals."}
              </p>
            </section>

            {selectedCrew.crew_keywords.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCrew.crew_keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                      #{kw}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <UserPlus className="w-3 h-3" /> Team Structure
              </h4>
              <div className="space-y-1.5">
                {selectedCrew.agent_member_ids.map((id) => (
                  <div key={id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-primary/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10">
                        {getInitials(id)}
                      </div>
                      <span className="text-xs font-semibold">{AGENT_NAMES[id] || "Specialist Agent"}</span>
                    </div>
                    {id === selectedCrew.manager_agent_id && (
                      <Badge className="text-[8px] h-4 px-1.5 py-0 uppercase font-bold bg-primary/20 text-primary border-none">Manager</Badge>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <FileText className="w-3 h-3" /> Context & Artefacts
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Inputs</span>
                  <div className="p-2 rounded border border-dashed text-[10px] flex items-center gap-2 truncate bg-muted/10">
                    <FileText className="w-3 h-3 opacity-40" /> research_brief.pdf
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Outputs</span>
                  <div className="p-2 rounded border border-dashed text-[10px] flex items-center gap-2 truncate bg-muted/10">
                    <FileText className="w-3 h-3 opacity-40" /> synteza_results.md
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Shield className="w-3 h-3" /> Governance
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/5 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Coordination</span>
                  <span className="font-bold">{selectedCrew.manager_agent_id ? "Managed" : "Self-Organizing"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Process Model</span>
                  <span className="font-bold">{selectedCrew.crew_process_type}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Force Strength</span>
                  <span className="font-bold">{selectedCrew.agent_member_ids.length} Active Nodes</span>
                </div>
              </div>
            </section>

            {selectedCrew.availability_workspace.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Availability
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCrew.availability_workspace.map((wsId) => (
                    <Badge key={wsId} variant="outline" className="text-[10px] font-normal">
                      {wsId.replace("ws-", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 bg-primary hover:bg-primary/90">Configure Unit</Button>
              <Button variant="outline" size="icon">
                <Edit2 className="w-4 h-4" />
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
