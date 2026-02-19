"use client";

import * as React from "react";
import { useTemplates } from "../application/use-templates";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { FileText, CheckCircle2, ListTodo, Trash2 } from "lucide-react";
import { SidePeek } from "./side-peek";
import { Button } from "@/shared/ui/ui/button";

interface TemplatesSectionProps {
  workspaceId: string;
}

export const TemplatesSection = ({ workspaceId }: TemplatesSectionProps) => {
  const { data: templates, isLoading } = useTemplates(workspaceId);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card className="border-dashed h-24 flex items-center justify-center text-muted-foreground text-sm italic">
        No SOP templates available.
      </Card>
    );
  }

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="hover:border-primary/50 transition-all cursor-pointer group hover:shadow-md"
            onClick={() => setSelectedTemplateId(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-3 w-3 text-primary shrink-0" />
                  <CardTitle className="text-sm font-bold truncate font-display">{template.template_name}</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-[10px] h-4 py-0 flex items-center gap-1 font-bold">
                  <ListTodo className="w-2 h-2" /> {template.template_checklist_items.length} Tasks
                </Badge>
                {template.template_keywords?.slice(0, 1).map((kw, i) => (
                  <span key={i} className="text-[9px] text-muted-foreground italic">#{kw}</span>
                ))}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <SidePeek
        open={!!selectedTemplateId}
        onOpenChange={(open) => !open && setSelectedTemplateId(null)}
        title={selectedTemplate?.template_name || "Template Details"}
        description="Standard Operating Procedure"
      >
        {selectedTemplate && (
          <div className="space-y-8">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Checklist Items</h4>
              <div className="space-y-2">
                {selectedTemplate.template_checklist_items.map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-primary/5">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold">{item.label || "Untitled Task"}</p>
                      {item.description && <p className="text-[10px] text-muted-foreground">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Markdown Body</h4>
              <div className="p-4 rounded-lg bg-background border border-muted font-mono text-[10px] leading-relaxed line-clamp-6">
                {selectedTemplate.template_markdown_content}
              </div>
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1">Use Template</Button>
              <Button variant="outline">Edit SOP</Button>
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
