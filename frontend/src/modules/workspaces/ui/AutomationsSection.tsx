"use client";

import * as React from "react";
import { useAutomations } from "../application/useAutomations";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  Zap,
  Play,
  Settings,
  Trash2,
  Edit2,
  Clock,
  History,
  AlertCircle,
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

interface AutomationsSectionProps {
  workspaceId: string;
  colorName?: string;
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

export const AutomationsSection = ({ workspaceId, colorName = "default" }: AutomationsSectionProps) => {
  const { data: automations, isLoading } = useAutomations(workspaceId);
  const [selectedAutomationId, setSelectedAutomationId] = React.useState<string | null>(null);

  const styles = getVisualStylesForZoneColor(colorName);
  const rgb = COLOR_TO_RGB[colorName] || COLOR_TO_RGB.default;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
      </div>
    );
  }

  if (!automations || automations.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No automations active. Set some triggers.
      </Card>
    );
  }

  const selectedAutomation = automations.find((a) => a.id === selectedAutomationId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automations.map((automation) => (
          <Card
            key={automation.id}
            className={cn(
                "relative overflow-hidden cursor-pointer flex flex-col pt-2 transition-all duration-200 rounded-xl h-full",
                "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
                "hover:shadow-md",
                `hover:${styles.borderClassName}`
            )}
            onClick={() => setSelectedAutomationId(automation.id)}
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
                    <Zap className="h-3 w-3 text-zinc-500" />
                  </div>
                  <CardTitle className="text-sm font-bold font-display group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{automation.automation_name}</CardTitle>
                </div>
                <Badge variant={automation.is_active ? "default" : "outline"} className={cn("text-[9px] h-4 py-0 uppercase font-bold tracking-tighter border-none", automation.is_active ? "bg-blue-500/10 text-blue-600" : "bg-muted/30")}>
                  {automation.is_active ? "active" : "paused"}
                </Badge>
              </div>
              <CardDescription className="text-[11px] mt-1 line-clamp-2 leading-relaxed">
                {automation.trigger_type} → {automation.action_type}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 mt-auto pt-0 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground opacity-40" />
                <span className="text-[10px] text-muted-foreground font-medium">Last run: 2h ago</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SidePeek
        open={!!selectedAutomationId}
        onOpenChange={(open) => !open && setSelectedAutomationId(null)}
        title={selectedAutomation?.automation_name || "Automation Details"}
        description={`${selectedAutomation?.trigger_type} Trigger`}
      >
        {selectedAutomation && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <History className="w-3 h-3" /> Execution Logic
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/5 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Trigger</span>
                  <span className="font-bold">{selectedAutomation.trigger_type}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Action</span>
                  <span className="font-bold">{selectedAutomation.action_type}</span>
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
