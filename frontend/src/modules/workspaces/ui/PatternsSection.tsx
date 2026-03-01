"use client";

import * as React from "react";
import { usePatterns } from "../application/usePatterns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  FileCode,
  Workflow,
  Search,
  BookOpen,
  ArrowRight,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

interface PatternsSectionProps {
  workspaceId: string;
  colorName?: string;
}

const COLOR_TO_RGB: Record<string, string> = {
    blue: "59, 130, 246",
    purple: "168, 85, 247",
    pink: "236, 72, 153",
    green: "34, 197, 94",
    yellow: "234, 179, 8",
    orange: "249, 115, 22",
    default: "113, 113, 122"
};

export const PatternsSection = ({ workspaceId, colorName = "default" }: PatternsSectionProps) => {
  const { data: patterns, isLoading } = usePatterns(workspaceId);
  const [selectedPatternId, setSelectedPatternId] = React.useState<string | null>(null);

  const styles = getVisualStylesForZoneColor(colorName);
  const rgb = COLOR_TO_RGB[colorName] || COLOR_TO_RGB.default;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
      </div>
    );
  }

  if (!patterns || patterns.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No workflow patterns found. Design some sequences.
      </Card>
    );
  }

  const selectedPattern = patterns.find((p) => p.id === selectedPatternId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <Card
            key={pattern.id}
            className={cn(
                "relative overflow-hidden cursor-pointer flex flex-col pt-2 transition-all duration-200 rounded-xl",
                "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
                "hover:shadow-md",
                `hover:${styles.borderClassName}`
            )}
            onClick={() => setSelectedPatternId(pattern.id)}
          >
            {/* Accent Top Bar */}
            <div 
                className={cn("absolute top-0 left-0 right-0 h-[2px] opacity-40 transition-opacity duration-200 group-hover:opacity-100 z-10", styles.hoverBackgroundClassName)} 
            />

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" 
                style={{ backgroundImage: `radial-gradient(rgb(${rgb}) 0.5px, transparent 0.5px)`, backgroundSize: '12px 12px' }} 
            />

            <CardHeader className="relative z-10 space-y-3 pb-3 pt-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-muted/30">
                    <Workflow className="h-3 w-3 text-zinc-500" />
                  </div>
                  <CardTitle className="text-sm font-bold font-display group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{pattern.pattern_name}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-[9px] h-4 py-0 uppercase font-black tracking-tight bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none">
                  {pattern.domain || "Workflow"}
                </Badge>
              </div>
              <CardDescription className="text-[11px] mt-1 line-clamp-2 leading-relaxed">
                {pattern.pattern_description || "Optimized process sequence."}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 mt-auto pt-0 pb-4">
              <div className="flex items-center gap-1 flex-wrap">
                {pattern.pattern_keywords?.slice(0, 2).map((kw, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground/60 italic font-medium">#{kw}</span>
                ))}
              </div>
            </CardContent>
          </Card>
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
