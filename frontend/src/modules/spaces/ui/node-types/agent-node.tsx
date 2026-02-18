"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";

export type AgentNodeData = {
  label: string;
  status: string;
  runtime?: {
    role?: string;
  };
};

export function AgentNode({ data }: NodeProps<{ label: string; status: string; runtime?: any }>) {
  return (
    <Card className="min-w-[180px] shadow-md border-primary/20">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary" />
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">Agent</Badge>
            <div className={`w-2 h-2 rounded-full ${data.status === 'Working' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
        </div>
        <CardTitle className="text-sm font-bold truncate">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-[10px] text-muted-foreground italic truncate">{data.status}</p>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
    </Card>
  );
}
