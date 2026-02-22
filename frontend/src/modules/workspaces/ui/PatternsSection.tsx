"use client";

import * as React from "react";
import { usePatterns } from "../application/usePatterns";
import { Card, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Share2, Network, Trash2 } from "lucide-react";
import { SidePeek } from "./SidePeek";
import { Button } from "@/shared/ui/ui/Button";

interface PatternsSectionProps {
  workspaceId: string;
}

export const PatternsSection = ({ workspaceId }: PatternsSectionProps) => {
  const { data: patterns, isLoading } = usePatterns(workspaceId);
  const [selectedPatternId, setSelectedPatternId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!patterns || patterns.length === 0) {
    return (
      <Card className="border-dashed h-24 flex items-center justify-center text-muted-foreground text-sm italic">
        No architectural patterns found.
      </Card>
    );
  }

  const selectedPattern = patterns.find((patternItem) => patternItem.id === selectedPatternId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <Card
            key={pattern.id}
            className="hover:border-primary/50 transition-all cursor-pointer group hover:shadow-md"
            onClick={() => setSelectedPatternId(pattern.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Share2 className="h-3 w-3 text-primary shrink-0" />
                  <CardTitle className="text-sm font-bold truncate font-display">{pattern.pattern_name}</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-[8px] h-3.5 px-1.5 uppercase font-bold tracking-tighter">
                  {pattern.pattern_type}
                </Badge>
                {pattern.pattern_keywords?.slice(0, 1).map((kw, i) => (
                  <span key={i} className="text-[9px] text-muted-foreground italic">#{kw}</span>
                ))}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <SidePeek
        open={!!selectedPatternId}
        onOpenChange={(open) => !open && setSelectedPatternId(null)}
        title={selectedPattern?.pattern_name || "Pattern Details"}
        description={selectedPattern?.pattern_type || "Graph Architecture"}
      >
        {selectedPattern && (
          <div className="space-y-8">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Network className="w-3 h-3" /> Graph Structure
              </h4>
              <div className="bg-muted/50 rounded-lg aspect-video flex items-center justify-center border border-muted-foreground/10">
                <div className="text-center">
                  <Share2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Preview not available in Peek</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 rounded bg-background border border-muted text-center">
                  <div className="text-[10px] text-muted-foreground uppercase">Nodes</div>
                  <div className="text-sm font-bold font-mono">{Object.keys(selectedPattern.pattern_graph_structure.nodes || {}).length}</div>
                </div>
                <div className="p-2 rounded bg-background border border-muted text-center">
                  <div className="text-[10px] text-muted-foreground uppercase">Edges</div>
                  <div className="text-sm font-bold font-mono">{Object.keys(selectedPattern.pattern_graph_structure.edges || {}).length}</div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Context</h4>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                {selectedPattern.pattern_okr_context || "No OKR context mapped to this pattern."}
              </p>
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1">Open Graph Editor</Button>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SidePeek>
    </>
  );
};
