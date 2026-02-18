"use client";

import { usePatterns } from "../application/use-workspaces";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Box } from "lucide-react";
import Link from "next/link";

interface PatternsSectionProps {
  workspaceId: string;
}

export const PatternsSection = ({ workspaceId }: PatternsSectionProps) => {
  const { data: patterns, isLoading } = usePatterns(workspaceId);

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
    );
  }

  if (!patterns || patterns.length === 0) {
    return <div className="p-4 border rounded-md text-muted-foreground text-sm">No patterns defined yet.</div>;
  }

  const previewPatterns = patterns.slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {previewPatterns.map((pattern) => (
        <Link key={pattern.id} href={`/workspaces/${workspaceId}/patterns/${pattern.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-semibold truncate pr-4">{pattern.name}</CardTitle>
                </div>
                {pattern.keywords && pattern.keywords.length > 0 && (
                    <div className="mt-1 text-[10px] text-muted-foreground italic">
                        #{pattern.keywords[0]}
                    </div>
                )}
            </CardHeader>
            </Card>
        </Link>
      ))}
    </div>
  );
};
