"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePatterns, useDeletePattern } from "../application/usePatterns";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { PatternProfilePeek } from "./PatternSidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { Button } from "@/shared/ui/ui/Button";
import { LayoutGrid, Plus } from "lucide-react";

type PatternsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const PatternsSection = ({ workspaceId, colorName = "default" }: PatternsSectionProps) => {
  const router = useRouter();
  const { data: patterns, isLoading } = usePatterns(workspaceId);
  const { mutate: deletePattern } = useDeletePattern(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  const [selectedPatternId, setSelectedPatternId] = React.useState<string | null>(null);
  const [patternToDeleteId, setPatternToDeleteId] = React.useState<string | null>(null);

  const displayPatterns = (patterns || []).slice(0, 4);

  const handleDelete = (patternId: string) => {
    setPatternToDeleteId(patternId);
  };

  const confirmDelete = () => {
    if (patternToDeleteId) {
      const patternId = patternToDeleteId;
      const pattern = patterns?.find(patternItem => patternItem.id === patternId);
      if (pattern) {
        deleteWithUndo(patternId, pattern.pattern_name, () => deletePattern(patternId));
      }
      setPatternToDeleteId(null);
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
      <Card className="border-dashed h-40 flex flex-col items-center justify-center px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5 gap-4">
        <span>No workflow patterns found. Design some sequences.</span>
      </Card>
    );
  }

  const selectedPattern = patterns.find((patternItem) => patternItem.id === selectedPatternId) || null;

  return (
    <>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {displayPatterns.map((pattern) => (
          <WorkspaceCardHorizontal 
            key={pattern.id}
            title={pattern.pattern_name}
            description={pattern.pattern_okr_context || "Optimized process sequence."}
            href="#"
            tags={pattern.pattern_keywords}
            resourceId={pattern.id}
            icon={LayoutGrid}
            onEdit={() => {
              router.push(`/workspaces/${workspaceId}/patterns/studio/${pattern.id}`);
            }}
            onClick={() => setSelectedPatternId(pattern.id)}
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

      <DestructiveDeleteModal
        isOpen={!!patternToDeleteId}
        onClose={() => setPatternToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Pattern"
        resourceName={patterns.find(patternItem => patternItem.id === patternToDeleteId)?.pattern_name || "this pattern"}
        affectedResources={[]}
      />
    </>
  );
};
