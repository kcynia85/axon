"use client";

import * as React from "react";
import { useTemplates } from "../application/useTemplates";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  FileText,
  Trash2,
  Copy,
  Layout,
  Hash,
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";

type TemplatesSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
}

export const TemplatesSection = ({ workspaceId, colorName = "default" }: TemplatesSectionProps) => {
  const { data: templates, isLoading } = useTemplates(workspaceId);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No templates registered. Draft some structures.
      </Card>
    );
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <WorkspaceCardHorizontal 
            key={template.id}
            title={template.template_name}
            description={template.template_description}
            href={`/workspaces/${workspaceId}/templates/${template.id}/edit`}
            badgeLabel={template.template_type}
            tags={template.template_keywords}
            onEdit={() => setSelectedTemplateId(template.id)}
            colorName={colorName}
          />
        ))}
      </div>

      <SidePeek
        open={!!selectedTemplateId}
        onOpenChange={(open) => !open && setSelectedTemplateId(null)}
        title={selectedTemplate?.template_name || "Template Details"}
        description={`${selectedTemplate?.template_type} Core Template`}
        modal={false}
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
