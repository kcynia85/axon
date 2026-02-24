"use client";

import * as React from "react";
import { useAutomations } from "../application/useAutomations";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Zap, Play, Settings2, Trash2, Cpu, Globe, Hash, Link as LinkIcon, Activity } from "lucide-react";
import { SidePeek } from "./SidePeek";
import { Button } from "@/shared/ui/ui/Button";

interface AutomationsSectionProps {
  workspaceId: string;
}

export const AutomationsSection = ({ workspaceId }: AutomationsSectionProps) => {
  const { data: automations, isLoading } = useAutomations(workspaceId);
  const [selectedAutoId, setSelectedAutoId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full" />)}
      </div>
    );
  }

  if (!automations || automations.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic">
        No autonomous triggers active.
      </Card>
    );
  }

  const selectedAuto = automations.find((automationItem) => automationItem.id === selectedAutoId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automations.map((auto) => (
          <Card
            key={auto.id}
            className="hover:border-primary/50 transition-all cursor-pointer group relative hover:shadow-lg h-full"
            onClick={() => setSelectedAutoId(auto.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Zap className="h-3 w-3 text-yellow-500 shrink-0" />
                  </div>
                  <CardTitle className="text-sm font-bold truncate font-display">{auto.automation_name}</CardTitle>
                </div>
                <Badge
                  variant={auto.automation_status === "Active" ? "default" : "outline"}
                  className="text-[8px] h-3.5 px-1 py-0 font-bold uppercase"
                >
                  {auto.automation_status || "Draft"}
                </Badge>
              </div>

              {auto.automation_description && (
                <CardDescription className="text-[11px] mt-2 line-clamp-2 leading-relaxed italic opacity-70">
                  {auto.automation_description}
                </CardDescription>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {auto.automation_keywords?.slice(0, 2).map((kw: string, i: number) => (
                    <span key={i} className="text-[9px] text-muted-foreground/60 italic">#{kw}</span>
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground font-mono opacity-40 uppercase tracking-tighter">
                  {auto.automation_platform || "Webhook"} Node
                </span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <SidePeek
        open={!!selectedAutoId}
        onOpenChange={(open) => !open && setSelectedAutoId(null)}
        title={selectedAuto?.automation_name || "Automation Details"}
        description={`${selectedAuto?.automation_platform} Integration Unit`}
      >
        {selectedAuto && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Runtime Logic
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/5 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">HTTP Method</span>
                  <span className="font-bold">{selectedAuto.automation_http_method || "POST"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Concurrency</span>
                  <span className="font-bold">Queue (FIFO)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Retry Policy</span>
                  <span className="font-bold">Standard (3x Delay)</span>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <LinkIcon className="w-3 h-3" /> Trigger Point
              </h4>
              <div className="p-3 rounded-lg bg-background border font-mono text-[10px] break-all border-dashed opacity-70">
                {selectedAuto.automation_webhook_url || "Hidden for security protocol"}
              </div>
            </section>

            {selectedAuto.automation_keywords && selectedAuto.automation_keywords.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAuto.automation_keywords.map((kw: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                      #{kw}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {selectedAuto.availability_workspace.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Availability
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAuto.availability_workspace.map((wsId: string) => (
                    <Badge key={wsId} variant="outline" className="text-[10px] font-normal">
                      {wsId.replace("ws-", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Activity className="w-3 h-3" /> Telemetry
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded bg-muted/20 border border-primary/5 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase opacity-60">Avg Latency</div>
                  <div className="text-sm font-bold font-mono">124ms</div>
                </div>
                <div className="p-3 rounded bg-muted/20 border border-primary/5 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase opacity-60">Success Rate</div>
                  <div className="text-sm font-bold font-mono text-green-500">99.8%</div>
                </div>
              </div>
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                <Play className="w-3 h-3" /> Trigger Now
              </Button>
              <Button variant="outline" size="icon">
                <Settings2 className="w-4 h-4" />
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
