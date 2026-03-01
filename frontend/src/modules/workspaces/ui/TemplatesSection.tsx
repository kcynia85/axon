"use client";

import * as React from "react";
import { useTemplates } from "../application/useTemplates";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  FileText,
  FileCode,
  Layout,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ArrowRight,
  ExternalLink,
  Hash,
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

interface TemplatesSectionProps {
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

export const TemplatesSection = ({ workspaceId, colorName = "default" }: TemplatesSectionProps) => {
  const { data: templates, isLoading } = useTemplates(workspaceId);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);

  const styles = getVisualStylesForZoneColor(colorName);
  const rgb = COLOR_TO_RGB[colorName] || COLOR_TO_RGB.default;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No templates registered. Draft some structures.
      </Card>
    );
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
                "relative overflow-hidden cursor-pointer flex flex-col pt-2 transition-all duration-200 rounded-xl",
                "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
                "hover:shadow-md",
                `hover:${styles.borderClassName}`
            )}
            onClick={() => setSelectedTemplateId(template.id)}
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
                    <FileText className="h-3 w-3 text-zinc-500" />
                  </div>
                  <CardTitle className="text-sm font-bold font-display group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{template.template_name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase font-bold tracking-tighter bg-muted/30 border-none">
                  {template.template_type}
                </Badge>
              </div>
              <CardDescription className="text-[11px] mt-1 line-clamp-2 leading-relaxed">
                {template.template_description || "Reusable document structure."}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 mt-auto pt-0 pb-4">
              <div className="flex items-center gap-1 flex-wrap">
                {template.template_keywords?.slice(0, 2).map((kw, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground/60 italic font-medium">#{kw}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SidePeek
        open={!!selectedTemplateId}
        onOpenChange={(open) => !open && setSelectedTemplateId(null)}
        title={selectedTemplate?.template_name || "Template Details"}
        description={`${selectedTemplate?.template_type} Core Template`}
      >
        {selectedTemplate && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Layout className="w-3 h-3" /> Description
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 p-4 rounded-lg border border-primary/5">
                {selectedTemplate.template_description || "Standardized template for rapid document generation and data consistency."}
              </p>
            </section>

            {selectedTemplate.template_keywords.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Metadata
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.template_keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                      #{kw}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 bg-primary hover:bg-primary/90">Apply Template</Button>
              <Button variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SidePeek>
    </>
  );
};
