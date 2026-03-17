"use client";

import * as React from "react";
import { usePatterns, useDeletePattern } from "../application/usePatterns";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { PatternProfilePeek } from "./PatternProfilePeek";

type PatternsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const PatternsSection = ({ workspaceId, colorName = "default" }: PatternsSectionProps) => {
  const { data: patterns, isLoading } = usePatterns(workspaceId);
  const { mutate: deletePattern } = useDeletePattern(workspaceId);
  const [selectedPatternId, setSelectedPatternId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this pattern?")) {
      deletePattern(id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />
        ))}
      </div>
    );
  }

  if (!patterns || patterns.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No workflow patterns found. Design some sequences.
      </Card>
    );
  }

  const selectedPattern = patterns.find((p) => p.id === selectedPatternId) || null;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <WorkspaceCardHorizontal 
            key={pattern.id}
            title={pattern.pattern_name}
            description={pattern.pattern_okr_context || "Optimized process sequence."}
            href={`/workspaces/${workspaceId}/patterns/${pattern.id}`}
            badgeLabel="Pattern"
            tags={pattern.pattern_keywords}
            resourceId={pattern.id}
            onEdit={() => setSelectedPatternId(pattern.id)}
            onDelete={handleDelete}
            colorName={colorName}
          />
        ))}
      </div>

      <PatternProfilePeek 
        pattern={selectedPattern}
        isOpen={!!selectedPatternId}
        onClose={() => setSelectedPatternId(null)}
        onInstantiate={() => {}} // TODO: Handle instantiate
      />
    </>
  );
};

