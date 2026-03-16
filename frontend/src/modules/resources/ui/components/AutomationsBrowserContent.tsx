import React from "react";
import { Automation } from "@/shared/domain/workspaces";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Zap, Clock, BarChart3, Play, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";

export type AutomationsBrowserContentProps = {
  readonly automations: readonly Automation[];
  readonly viewMode: "grid" | "list";
  readonly onViewDetails: (automationIdentifier: string) => void;
  readonly onDelete?: (automationIdentifier: string) => void;
  readonly isLoading?: boolean;
  readonly isError?: boolean;
};

/**
 * AutomationsBrowserContent: Pure presentational component for displaying the automation library.
 */
export const AutomationsBrowserContent = ({
  automations,
  viewMode,
  onViewDetails,
  onDelete,
  isLoading,
  isError
}: AutomationsBrowserContentProps) => {
  if (isLoading) {
    return (
      <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-2"}>
        {[1, 2, 3, 4, 5, 6].map((skeletonIdentifier) => (
          <Skeleton key={skeletonIdentifier} className={viewMode === "grid" ? "h-44 w-full" : "h-16 w-full"} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-12 text-destructive">Failed to load automations.</div>;
  }

  if (automations.length === 0) {
    return <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed rounded-xl">No automations found.</div>;
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {automations.map((automation) => (
          <Card 
            key={automation.id} 
            className="group hover:border-primary/50 transition-all flex items-center justify-between p-4 bg-muted/5 cursor-pointer relative"
            onClick={() => onViewDetails(automation.id)}
          >
            <div className="flex items-center gap-4">
              <Zap className="w-4 h-4 text-yellow-500" />
              <div>
                <h4 className="text-sm font-bold">{automation.automation_name}</h4>
                <p className="text-[10px] text-muted-foreground">{automation.automation_platform} • {automation.automation_webhook_url}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={automation.automation_validation_status === "Valid" ? "default" : "secondary"} className="text-[8px]">
                {automation.automation_validation_status}
              </Badge>
              {onDelete && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); }}
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(automation.id);
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {automations.map((automation) => (
        <Card 
          key={automation.id} 
          className="group hover:border-primary/50 transition-all flex flex-col bg-muted/5 cursor-pointer"
          onClick={() => onViewDetails(automation.id)}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500" />
                <CardTitle className="text-sm font-bold truncate pr-6">{automation.automation_name}</CardTitle>
              </div>
              <Badge variant={automation.automation_validation_status === "Valid" ? "default" : "secondary"} className="text-[8px] h-4">
                {automation.automation_validation_status || "Idle"}
              </Badge>
            </div>
            <CardDescription className="text-[10px] mt-1 italic">
              Platform: {automation.automation_platform}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-4">
            <div className="bg-background border rounded p-3 flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-[8px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Clock className="w-2 h-2" /> Last Sync
                </div>
                <div className="text-[10px] font-mono">2h ago</div>
              </div>
              <div className="h-8 w-[1px] bg-muted" />
              <div className="space-y-1 text-right">
                <div className="text-[8px] uppercase font-bold text-muted-foreground flex items-center gap-1 justify-end">
                  <BarChart3 className="w-2 h-2" /> Volume
                </div>
                <div className="text-[10px] font-mono">High</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="default" size="sm" className="flex-1 h-7 text-[10px] gap-2" onClick={(clickEvent) => { clickEvent.stopPropagation(); /* handle run */ }}>
                <Play className="w-3 h-3" /> Test Run
              </Button>
              {onDelete && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={(clickEvent) => { clickEvent.stopPropagation(); }}
                        >
                            <MoreHorizontal className="w-3 h-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(automation.id);
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
