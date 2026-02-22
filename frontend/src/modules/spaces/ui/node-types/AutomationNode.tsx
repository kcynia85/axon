"use client";

import { Handle, Position } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Zap } from "lucide-react";

export type AutomationNodeData = {
  label: string;
  status: string;
  runtime?: Record<string, unknown>;
};

export function AutomationNode({ data }: { data: AutomationNodeData }) {
  return (
    <Card className="min-w-[180px] shadow-md border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-amber-500" />
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-amber-300 dark:border-amber-700">
            <Zap className="w-3 h-3 mr-1" />
            Automation
          </Badge>
          <div className={`w-2 h-2 rounded-full ${
            data.status === 'Working' ? 'bg-green-500 animate-pulse' : 
            data.status === 'Done' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
          }`} />
        </div>
        <CardTitle className="text-sm font-bold truncate">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-[10px] text-muted-foreground italic truncate">{data.status}</p>
      </CardContent>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-amber-500" />
    </Card>
  );
}
