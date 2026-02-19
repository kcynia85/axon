"use client";

import { Handle, Position } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";
import { Wrench } from "lucide-react";

export type ServiceNodeData = {
  label: string;
  status: string;
  runtime?: Record<string, unknown>;
};

export function ServiceNode({ data }: { data: ServiceNodeData }) {
  return (
    <Card className="min-w-[180px] shadow-md border-cyan-200 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-900/20">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-cyan-500" />
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-cyan-300 dark:border-cyan-700">
            <Wrench className="w-3 h-3 mr-1" />
            Service
          </Badge>
          <div className={`w-2 h-2 rounded-full ${
            data.status === 'Working' ? 'bg-green-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
          }`} />
        </div>
        <CardTitle className="text-sm font-bold truncate">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-[10px] text-muted-foreground italic truncate">{data.status}</p>
      </CardContent>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-cyan-500" />
    </Card>
  );
}
