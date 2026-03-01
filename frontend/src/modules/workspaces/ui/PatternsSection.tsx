"use client";

import * as React from "react";
import { usePatterns } from "../application/usePatterns";
import { Card, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  Share2,
  Network,
  Trash2,
  Layers,
  Box,
  Layout,
  Hash,
  FileText,
  Users,
  Zap,
  Globe,
  Quote
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";

/** Mapping for related component IDs to readable names */
const COMPONENTS_MAPPING: Record<string, { label: string; icon: React.ElementType }> = {
  "t-prd-template": { label: "PRD Template", icon: FileText },
  "c-prd-crew": { label: "PRD Production Crew", icon: Users },
  "a-product-owner": { label: "Product Owner", icon: Zap },
};

interface PatternsSectionProps {
  workspaceId: string;
}

interface PatternGraphStructure {
  nodes?: unknown[];
  edges?: unknown[];
  components?: string[];
}

export const PatternsSection = ({ workspaceId }: PatternsSectionProps) => {
  const { data: patterns, isLoading } = usePatterns(workspaceId);
  const [selectedPatternId, setSelectedPatternId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full" />)}
      </div>
    );
  }

  if (!patterns || patterns.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic">
        No architectural patterns found.
      </Card>
    );
  }

  const selectedPattern = patterns.find((patternItem) => patternItem.id === selectedPatternId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => {
          const structure = pattern.pattern_graph_structure as PatternGraphStructure;
          const nodeCount = Object.keys(structure.nodes || {}).length;
          
          return (
            <Card
              key={pattern.id}
              className="hover:border-primary/50 transition-all cursor-pointer group relative hover:shadow-lg h-full"
              onClick={() => setSelectedPatternId(pattern.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1.5 rounded bg-primary/10">
                      <Share2 className="h-3 w-3 text-primary shrink-0" />
                    </div>
                    <CardTitle className="text-sm font-bold truncate font-display">{pattern.pattern_name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase font-bold tracking-tighter">
                    {pattern.pattern_type}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 mt-3 flex-wrap">
                  {pattern.pattern_keywords?.slice(0, 2).map((kw, i) => (
                    <span key={i} className="text-[10px] text-muted-foreground/60 italic">#{kw}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono opacity-60">
                    <Network className="w-3 h-3" />
                    <span>{nodeCount} nodes</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono opacity-40">#{pattern.id.slice(0, 4)}</span>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <SidePeek
        open={!!selectedPatternId}
        onOpenChange={(open) => !open && setSelectedPatternId(null)}
        title={selectedPattern?.pattern_name || "Pattern Details"}
        description={`${selectedPattern?.pattern_type || "Graph Architecture"} Overview`}
      >
        {selectedPattern && (() => {
          const structure = selectedPattern.pattern_graph_structure as PatternGraphStructure;
          return (
            <div className="space-y-6">
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Quote className="w-3 h-3" /> OKR Context
                </h4>
                <p className="text-sm leading-relaxed text-foreground/80 bg-primary/5 p-4 rounded-lg border border-primary/10 italic">
                  &quot;{selectedPattern.pattern_okr_context || "Achieve operational excellence through standardized workflows."}&quot;
                </p>
              </section>

              {selectedPattern.pattern_keywords.length > 0 && (
                <section className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Hash className="w-3 h-3" /> Keywords
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

              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Layers className="w-3 h-3" /> System Components
                </h4>
                <div className="space-y-1.5">
                  {(structure.components || []).map((compId: string) => {
                    const mapped = COMPONENTS_MAPPING[compId] || { label: compId, icon: Box };
                    return (
                      <div key={compId} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-primary/5 transition-colors hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-background border border-muted">
                            <mapped.icon className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-semibold">{mapped.label}</span>
                        </div>
                        <Badge variant="outline" className="text-[8px] h-4 py-0 opacity-60">Linked</Badge>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Network className="w-3 h-3" /> Graph Architecture
                </h4>
                <div className="bg-muted/50 rounded-lg p-6 border border-primary/5 space-y-4">
                  <div className="flex items-center justify-center py-4 bg-background/50 rounded border border-dashed border-muted">
                    <Share2 className="w-12 h-12 text-primary opacity-20" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-background border border-muted text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Nodes</div>
                      <div className="text-xl font-bold font-mono tracking-tighter">
                        {Object.keys(structure.nodes || {}).length}
                      </div>
                    </div>
                    <div className="p-3 rounded bg-background border border-muted text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Edges</div>
                      <div className="text-xl font-bold font-mono tracking-tighter">
                        {Object.keys(structure.edges || {}).length}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Context & Artefacts
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Reference</span>
                    <div className="p-2 rounded border border-dashed text-[10px] flex items-center gap-2 truncate bg-muted/10">
                      <FileText className="w-3 h-3 opacity-40" /> brand_guidelines.pdf
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dependency</span>
                    <div className="p-2 rounded border border-dashed text-[10px] flex items-center gap-2 truncate bg-muted/10">
                      <FileText className="w-3 h-3 opacity-40" /> market_map.json
                    </div>
                  </div>
                </div>
              </section>

              {selectedPattern.availability_workspace.length > 0 && (
                <section className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Availability
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPattern.availability_workspace.map((wsId) => (
                      <Badge key={wsId} variant="outline" className="text-[10px] font-normal">
                        {wsId.replace("ws-", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex gap-3 pt-6 border-t border-muted">
                <Button className="flex-1 bg-primary hover:bg-primary/90">Open Architecture Editor</Button>
                <Button variant="outline" size="icon" className="hover:bg-primary/5">
                  <Layout className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })()}
      </SidePeek>
    </>
  );
};
