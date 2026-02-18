"use client";

import { useAutomations } from "../application/use-workspaces";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Zap } from "lucide-react";
import Link from "next/link";

interface AutomationsSectionProps {
  workspaceId: string;
}

export const AutomationsSection = ({ workspaceId }: AutomationsSectionProps) => {
  const { data: automations, isLoading } = useAutomations(workspaceId);

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
    );
  }

  if (!automations || automations.length === 0) {
    return <div className="p-4 border rounded-md text-muted-foreground text-sm">No automations configured yet.</div>;
  }

  const previewAutomations = automations.slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {previewAutomations.map((auto) => (
        <Link key={auto.id} href={`/workspaces/${workspaceId}/automations/${auto.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-primary" />
                        <CardTitle className="text-sm font-semibold truncate">{auto.name}</CardTitle>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="text-[10px] text-muted-foreground italic">
                        #{auto.keywords?.[0] || 'finanse'}
                    </div>
                    <Badge variant="outline" className="text-[10px] h-4 py-0">{auto.status}</Badge>
                </div>
            </CardHeader>
            </Card>
        </Link>
      ))}
    </div>
  );
};
