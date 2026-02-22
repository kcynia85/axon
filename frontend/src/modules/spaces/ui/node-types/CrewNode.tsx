"use client";

import { Handle, Position } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Zap, ArrowRight, Crown } from "lucide-react";

export type CrewNodeData = {
  label: string;
  status: string;
  runtime?: {
    process_type?: "sequential" | "parallel" | "hierarchical";
  };
};

const ProcessIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case "parallel":
      return <Zap className="w-3 h-3 text-yellow-500" />;
    case "sequential":
      return <ArrowRight className="w-3 h-3 text-blue-500" />;
    case "hierarchical":
      return <Crown className="w-3 h-3 text-purple-500" />;
    default:
      return null;
  }
};

export function CrewNode({ data }: { data: CrewNodeData }) {
  const processType = data.runtime?.process_type;
  
  return (
    <Card className="min-w-[180px] shadow-md border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/20">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-orange-500" />
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-orange-300 dark:border-orange-700">
            Crew
          </Badge>
          <div className="flex items-center gap-1">
            {processType && <ProcessIcon type={processType} />}
            <div className={`w-2 h-2 rounded-full ${
              data.status === 'Working' ? 'bg-green-500 animate-pulse' : 
              data.status === 'Done' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
            }`} />
          </div>
        </div>
        <CardTitle className="text-sm font-bold truncate">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-[10px] text-muted-foreground italic truncate">{data.status}</p>
      </CardContent>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-orange-500" />
    </Card>
  );
}
