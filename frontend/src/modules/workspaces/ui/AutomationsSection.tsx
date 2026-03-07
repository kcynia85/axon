"use client";

import * as React from "react";
import { useAutomations } from "../application/useAutomations";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  Zap,
  Settings,
  Trash2,
  Clock,
  History,
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";

type AutomationsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
}

export const AutomationsSection = ({ workspaceId, colorName = "default" }: AutomationsSectionProps) => {
  const { data: automations, isLoading } = useAutomations(workspaceId);
  const [selectedAutomationId, setSelectedAutomationId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="aspect-[2/3] w-[236px] shadow-sm rounded-xl" />)}
      </div>
    );
  }

  if (!automations || automations.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No automations active. Set some triggers.
      </Card>
    );
  }

  const selectedAutomation = automations.find((a) => a.id === selectedAutomationId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automations.map((automation) => (
          <WorkspaceCardHorizontal 
            key={automation.id}
            title={automation.automation_name}
            description={`${automation.automation_platform} Integration`}
            href={`/workspaces/${workspaceId}/automations/${automation.id}`}
            badgeLabel={automation.automation_status}
            icon={Zap}
            onEdit={() => setSelectedAutomationId(automation.id)}
            colorName={colorName}
            footerContent={
                <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground opacity-40" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Active</span>
                </div>
            }
          />
        ))}
      </div>

      <SidePeek
        open={!!selectedAutomationId}
        onOpenChange={(open) => !open && setSelectedAutomationId(null)}
        title={selectedAutomation?.automation_name || "Automation Details"}
        description={`${selectedAutomation?.automation_platform} Trigger`}
        modal={false}
      >
        {selectedAutomation && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <History className="w-3 h-3" /> Execution Logic
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/5 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Platform</span>
                  <span className="font-bold">{selectedAutomation.automation_platform}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-bold">{selectedAutomation.automation_status}</span>
                </div>
              </div>
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 bg-primary hover:bg-primary/90">Test Logic</Button>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
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
