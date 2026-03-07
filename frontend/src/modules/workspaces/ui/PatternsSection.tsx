"use client";

import * as React from "react";
import { usePatterns } from "../application/usePatterns";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  Workflow,
  BookOpen,
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";

type PatternsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
}

export const PatternsSection = ({ workspaceId, colorName = "default" }: PatternsSectionProps) => {
  const { data: patterns, isLoading } = usePatterns(workspaceId);
  const [selectedPatternId, setSelectedPatternId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
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

  const selectedPattern = patterns.find((p) => p.id === selectedPatternId);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <WorkspaceCardHorizontal 
            key={pattern.id}
            title={pattern.pattern_name}
            description={pattern.pattern_description || "Optimized process sequence."}
            href={`/workspaces/${workspaceId}/patterns/${pattern.id}`}
            badgeLabel={pattern.domain || "Workflow"}
            tags={pattern.pattern_keywords}
            onEdit={() => setSelectedPatternId(pattern.id)}
            colorName={colorName}
          />
        ))}
      </div>

      <SidePeek
        open={!!selectedPatternId}
        onOpenChange={(open) => !open && setSelectedPatternId(null)}
        title={selectedPattern?.pattern_name || "Pattern Details"}
        description={`${selectedPattern?.domain} Domain Pattern`}
      >
        {selectedPattern && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Workflow className="w-3 h-3" /> Architecture
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 p-4 rounded-lg border border-primary/5">
                {selectedPattern.pattern_description || "Detailed workflow blueprint for specialized execution."}
              </p>
            </section>

            {selectedPattern.pattern_keywords.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Taxonomy
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPattern.pattern_keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                      #{kw}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 bg-primary hover:bg-primary/90">Instantiate Pattern</Button>
              <Button variant="outline" className="flex-1">View Blueprint</Button>
            </div>
          </div>
        )}
      </SidePeek>
    </>
  );
};
