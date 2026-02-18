"use client";

import { useCrews } from "../application/use-workspaces";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Users } from "lucide-react";
import Link from "next/link";

interface CrewsSectionProps {
  workspaceId: string;
}

export const CrewsSection = ({ workspaceId }: CrewsSectionProps) => {
  const { data: crews, isLoading } = useCrews(workspaceId);

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
    );
  }

  if (!crews || crews.length === 0) {
    return <div className="p-4 border rounded-md text-muted-foreground text-sm">No crews defined yet.</div>;
  }

  const previewCrews = crews.slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {previewCrews.map((crew) => (
        <Link key={crew.id} href={`/workspaces/${workspaceId}/crews/${crew.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-primary" />
                        <CardTitle className="text-sm font-semibold">{crew.name}</CardTitle>
                    </div>
                </div>
                <CardDescription className="text-xs mt-1">
                    {crew.agents.length} Agents involved.
                </CardDescription>
                <div className="mt-2">
                    <Badge variant="outline" className="text-[10px] h-4 py-0 capitalize">{crew.process}</Badge>
                </div>
            </CardHeader>
            </Card>
        </Link>
      ))}
    </div>
  );
};
