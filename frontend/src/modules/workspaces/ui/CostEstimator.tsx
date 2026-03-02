import React from "react";
import { Badge } from "@/shared/ui/ui/Badge";
import { Progress } from "@/shared/ui/ui/Progress"; // Assuming this exists or using simple div
import { CostEstimate } from "@/shared/domain/workspaces";

type CostEstimateProps = {
  readonly estimate: CostEstimate;
}

export const CostEstimator = ({ estimate }: CostEstimateProps) => {
  const { totalEstimate, staticCost, dynamicCost, breakdown } = estimate;
  
  // Normalized percentage for breakdown (capped at 100)
  const setupPercent = Math.min(100, (breakdown.agentSetup / totalEstimate) * 100);
  const toolPercent = Math.min(100, (breakdown.toolCalls / totalEstimate) * 100);
  
  return (
    <div className="bg-muted/30 p-4 rounded-xl border border-primary/5 space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estimated Run Cost</p>
          <p className="text-2xl font-black font-mono tracking-tighter text-primary">
            ${totalEstimate.toFixed(4)}
          </p>
        </div>
        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter bg-background/50">
          JSON Mode
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
          <span>Static: ${staticCost.toFixed(4)}</span>
          <span>Dynamic: ${dynamicCost.toFixed(4)}</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
          <div className="h-full bg-primary" style={{ width: `${setupPercent}%` }} />
          <div className="h-full bg-blue-400" style={{ width: `${toolPercent}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1 border-t border-primary/5">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-muted-foreground">Setup</span>
          <span className="font-mono font-bold">${breakdown.agentSetup.toFixed(4)}</span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-muted-foreground">Tools</span>
          <span className="font-mono font-bold">${breakdown.toolCalls.toFixed(4)}</span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-muted-foreground">Input</span>
          <span className="font-mono font-bold">{breakdown.inputTokens} tk</span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-muted-foreground">Output</span>
          <span className="font-mono font-bold">{breakdown.outputTokens} tk</span>
        </div>
      </div>
    </div>
  );
};
