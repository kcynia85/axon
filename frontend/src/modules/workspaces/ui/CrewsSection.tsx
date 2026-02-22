"use client";

import * as React from "react";
import { useCrews } from "../application/useCrews";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Users, Workflow, Shield, Trash2, Edit2 } from "lucide-react";
import { SidePeek } from "./SidePeek";
import { Button } from "@/shared/ui/ui/Button";

interface CrewsSectionProps {
  workspaceId: string;
}

export const CrewsSection = ({ workspaceId }: CrewsSectionProps) => {
  const { data: crews, isLoading } = useCrews(workspaceId);
  const [selectedCrewId, setSelectedCrewId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!crews || crews.length === 0) {
    return (
      <Card className="border-dashed h-24 flex items-center justify-center text-muted-foreground text-sm italic">
        No crews assembled. Strategy requires team effort.
      </Card>
    );
  }

  const selectedCrew = crews.find((crewItem) => crewItem.id === selectedCrewId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {crews.map((crew) => (
          <Card
            key={crew.id}
            className="hover:border-primary/50 transition-all cursor-pointer group hover:shadow-md h-full"
            onClick={() => setSelectedCrewId(crew.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Users className="h-3 w-3 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-bold font-display">{crew.crew_name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase font-bold tracking-tighter">
                  {crew.crew_process_type}
                </Badge>
              </div>
              <CardDescription className="text-[10px] mt-2 line-clamp-1 italic">
                {crew.crew_description || "Dynamic tactical unit."}
              </CardDescription>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {crew.agent_member_ids.slice(0, 4).map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">
                      A{i + 1}
                    </div>
                  ))}
                  {crew.agent_member_ids.length > 4 && (
                    <div className="w-5 h-5 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[8px] font-bold">
                      +{crew.agent_member_ids.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground font-mono">ID: {crew.id.slice(0, 4)}</span>
              </div>
            </CardHeader>
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
          <div className="space-y-8">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Workflow className="w-3 h-3" /> Mission Protocol
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {selectedCrew.crew_description || "This crew follows a tactical process to achieve its goals within the workspace domain."}
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Shield className="w-3 h-3" /> Command Structure
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Manager Link</span>
                  <span className="font-mono text-[10px]">{selectedCrew.manager_agent_id ? "Active Node" : "Decentralized"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Force Strength</span>
                  <span className="font-bold">{selectedCrew.agent_member_ids.length} Units</span>
                </div>
              </div>
            </section>section

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1">Configure Unit</Button>
              <Button variant="outline" size="icon">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SidePeek>
    </>
  );
};
