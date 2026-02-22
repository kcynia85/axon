"use client";

import { Handle, Position } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";

export type AgentNodeData = {
  label: string;
  status: string;
  runtime?: {
    role?: string;
  };
};

export function AgentNode({ data }: { data: AgentNodeData }) {
  return (
    <Card className="min-w-[180px] shadow-md border-primary/20 dark:border-primary/40 bg-card">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-primary/20">Agent</Badge>
            <div className={`w-2 h-2 rounded-full ${data.status === 'Working' ? 'bg-green-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />
        </div>
        <CardTitle className="text-sm font-bold truncate">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-[10px] text-muted-foreground italic truncate">{data.status}</p>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </Card>
  );
}
