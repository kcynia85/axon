"use client";

import * as React from "react";
import { useCrews } from "../application/useCrews";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
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
import { cn } from "@/shared/lib/utils";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

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

const COLOR_TO_RGB: Record<string, string> = {
    blue: "59, 130, 246",
    purple: "168, 85, 247",
    pink: "236, 72, 153",
    green: "34, 197, 94",
    yellow: "234, 179, 8",
    orange: "249, 115, 22",
    default: "113, 113, 122"
};

export const CrewsSection = ({ workspaceId, colorName = "default" }: CrewsSectionProps) => {
  const { data: crews, isLoading } = useCrews(workspaceId);
  const [selectedCrewId, setSelectedCrewId] = React.useState<string | null>(null);

  const styles = getVisualStylesForZoneColor(colorName);
  const rgb = COLOR_TO_RGB[colorName] || COLOR_TO_RGB.default;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
      </div>
    );
  }

  if (!crews || crews.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic rounded-xl bg-muted/5">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {crews.map((crew) => (
          <Card
            key={crew.id}
            className={cn(
                "relative overflow-hidden cursor-pointer flex flex-col pt-2 transition-all duration-200 rounded-xl h-full",
                "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
                "hover:shadow-md",
                `hover:${styles.borderClassName}`
            )}
            onClick={() => setSelectedCrewId(crew.id)}
          >
            {/* Accent Top Bar */}
            <div 
                className={cn("absolute top-0 left-0 right-0 h-[2px] opacity-40 transition-opacity duration-200 group-hover:opacity-100 z-10", styles.hoverBackgroundClassName)} 
            />

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" 
                style={{ backgroundImage: `radial-gradient(rgb(${rgb}) 0.5px, transparent 0.5px)`, backgroundSize: '12px 12px' }} 
            />

            <CardHeader className="relative z-10 space-y-3 pb-3 pt-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-muted/30">
                    <Users className="h-3 w-3 text-zinc-500" />
                  </div>
                  <CardTitle className="text-sm font-bold font-display group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{crew.crew_name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase font-bold tracking-tighter bg-muted/30 border-none">
                  {crew.crew_process_type}
                </Badge>
              </div>
              <CardDescription className="text-[11px] mt-1 line-clamp-2 leading-relaxed">
                {crew.crew_description || "Dynamic tactical unit."}
              </CardDescription>

              <div className="flex items-center gap-1 mt-2 flex-wrap">
                {crew.crew_keywords?.slice(0, 2).map((kw, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground/60 italic font-medium">#{kw}</span>
                ))}
              </div>
            </CardHeader>

            <CardContent className="relative z-10 mt-auto pt-0 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {crew.agent_member_ids.slice(0, 4).map((id) => (
                    <div
                      key={id}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-muted flex items-center justify-center text-[8px] font-bold shadow-sm"
                      title={AGENT_NAMES[id] || "Agent"}
                    >
                      {getInitials(id)}
                    </div>
                  ))}
                  {crew.agent_member_ids.length > 4 && (
                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-blue-500/10 text-blue-600 flex items-center justify-center text-[8px] font-bold shadow-sm">
                      +{crew.agent_member_ids.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground font-mono opacity-40">#{crew.id.slice(0, 4)}</span>
              </div>
            </CardContent>
          </Card>
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
