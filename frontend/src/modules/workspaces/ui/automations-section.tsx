"use client";

import * as React from "react";
import { useAutomations } from "../application/use-automations";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Zap, Play, Settings2, Trash2, Cpu } from "lucide-react";
import { SidePeek } from "./side-peek";
import { Button } from "@/shared/ui/ui/button";

interface AutomationsSectionProps {
  workspaceId: string;
}

export const AutomationsSection = ({ workspaceId }: AutomationsSectionProps) => {
  const { data: automations, isLoading } = useAutomations(workspaceId);
  const [selectedAutoId, setSelectedAutoId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!automations || automations.length === 0) {
    return (
      <Card className="border-dashed h-24 flex items-center justify-center text-muted-foreground text-sm italic">
        No autonomous triggers active.
      </Card>
    );
  }

  const selectedAuto = automations.find(a => a.id === selectedAutoId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automations.map((auto) => (
          <Card
            key={auto.id}
            className="hover:border-primary/50 transition-all cursor-pointer group hover:shadow-md h-full"
            onClick={() => setSelectedAutoId(auto.id)}
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Zap className="h-3 w-3 text-yellow-500 shrink-0" />
                  <CardTitle className="text-sm font-bold truncate font-display">{auto.automation_name || auto.name}</CardTitle>
                </div>
                <Badge
                  variant={auto.automation_status === "Active" ? "default" : "outline"}
                  className="text-[8px] h-3.5 px-1 py-0 font-bold uppercase"
                >
                  {auto.automation_status || "Draft"}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {auto.automation_keywords?.slice(0, 2).map((kw: string, i: number) => (
                    <span key={i} className="text-[9px] text-muted-foreground/60 italic">#{kw}</span>
                  ))}
                </div>
                <span className="text-[9px] font-mono opacity-40">{auto.automation_platform || "Webhook"}</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <SidePeek
        open={!!selectedAutoId}
        onOpenChange={(open) => !open && setSelectedAutoId(null)}
        title={selectedAuto?.automation_name || selectedAuto?.name || "Automation Details"}
        description={`${selectedAuto?.automation_platform} Integration`}
      >
        {selectedAuto && (
          <div className="space-y-8">
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
                  <span className="text-muted-foreground">Retry Policy</span>
                  <span className="font-bold">Standard (3x)</span>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Trigger URL</h4>
              <div className="p-3 rounded-lg bg-background border font-mono text-[10px] break-all border-dashed">
                {selectedAuto.automation_webhook_url || "Hidden for security"}
              </div>
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 gap-2">
                <Play className="w-3 h-3" /> Execute Now
              </Button>
              <Button variant="outline" size="icon">
                <Settings2 className="w-4 h-4" />
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
