"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePatterns, useDeletePattern } from "../application/usePatterns";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { PatternProfilePeek } from "./PatternProfilePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { toast } from "sonner";
import { LayoutGrid } from "lucide-react";

type PatternsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const PatternsSection = ({ workspaceId, colorName = "default" }: PatternsSectionProps) => {
  const router = useRouter();
  const { data: patterns, isLoading } = usePatterns(workspaceId);
  const { mutate: deletePattern } = useDeletePattern(workspaceId);
  const [selectedPatternId, setSelectedPatternId] = React.useState<string | null>(null);
  const [patternToDeleteId, setPatternToDeleteId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    setPatternToDeleteId(id);
  };

  const confirmDelete = () => {
    if (patternToDeleteId) {
      deletePattern(patternToDeleteId);
      setPatternToDeleteId(null);
      toast.success("Wzorzec usunięty");
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

  const displayPatterns = React.useMemo(() => {
    if (!patterns) return [];
    return patterns.slice(0, 4);
  }, [patterns]);

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
        resourceName={patterns.find(p => p.id === patternToDeleteId)?.pattern_name || "this pattern"}
        affectedResources={[]}
      />
    </>
  );
};
