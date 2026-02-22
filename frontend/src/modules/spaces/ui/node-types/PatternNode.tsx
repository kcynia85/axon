"use client";

import { Handle, Position } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Layers } from "lucide-react";

export type PatternNodeData = {
  label: string;
  status: string;
  runtime?: Record<string, unknown>;
};

export function PatternNode({ data }: { data: PatternNodeData }) {
  return (
    <Card className="min-w-[180px] shadow-md border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-500" />
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-purple-300 dark:border-purple-700">
            <Layers className="w-3 h-3 mr-1" />
            Pattern
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
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500" />
    </Card>
  );
}
