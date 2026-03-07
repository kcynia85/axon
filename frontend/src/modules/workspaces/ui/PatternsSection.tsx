"use client";

import * as React from "react";
import { usePatterns } from "../application/usePatterns";
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
  const [selectedPatternId, setSelectedPatternId] = React.useState<string | null>(null);

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
            description={pattern.pattern_description || "Optimized process sequence."}
            href={`/workspaces/${workspaceId}/patterns/${pattern.id}`}
            badgeLabel={pattern.pattern_type}
            tags={pattern.pattern_keywords}
            onEdit={() => setSelectedPatternId(pattern.id)}
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
