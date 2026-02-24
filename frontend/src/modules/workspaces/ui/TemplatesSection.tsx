"use client";

import * as React from "react";
import { useTemplates } from "../application/useTemplates";
import { Card, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  FileText,
  CheckCircle2,
  ListTodo,
  Trash2,
  Hash,
  ArrowDownToLine,
  ArrowUpFromLine,
  Globe
} from "lucide-react";
import { SidePeek } from "./SidePeek";
import { Button } from "@/shared/ui/ui/Button";

interface TemplatesSectionProps {
  workspaceId: string;
}

export const TemplatesSection = ({ workspaceId }: TemplatesSectionProps) => {
  const { data: templates, isLoading } = useTemplates(workspaceId);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full" />)}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic">
        No SOP templates available.
      </Card>
    );
  }

  const selectedTemplate = templates.find((templateItem) => templateItem.id === selectedTemplateId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="hover:border-primary/50 transition-all cursor-pointer group relative hover:shadow-lg h-full"
            onClick={() => setSelectedTemplateId(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-1.5 rounded bg-primary/10">
                    <FileText className="h-3 w-3 text-primary shrink-0" />
                  </div>
                  <CardTitle className="text-sm font-bold truncate font-display">{template.template_name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] h-4 py-0 flex items-center gap-1 font-bold">
                  <ListTodo className="w-2 h-2" /> {template.template_checklist_items.length} Tasks
                </Badge>
              </div>

              <div className="flex items-center gap-1 mt-3 flex-wrap">
                {template.template_keywords?.slice(0, 2).map((kw, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground/60 italic">#{kw}</span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground font-mono opacity-40">#{template.id.slice(0, 4)}</span>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest opacity-40">SOP Module</span>
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
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <FileText className="w-3 h-3" /> SOP Description
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 p-4 rounded-lg border border-primary/5">
                {selectedTemplate.template_description || "Standard workflow defined for consistent delivery quality and repeatable results across the workspace."}
              </p>
            </section>

            {selectedTemplate.template_keywords.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Keywords
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

            <section className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <ArrowDownToLine className="w-3 h-3" /> Context
                </h4>
                <div className="space-y-2">
                  {(selectedTemplate.template_inputs || []).map((input) => (
                    <div key={input.id} className="flex justify-between items-center p-2.5 rounded-lg bg-muted/20 border border-primary/5 text-xs group hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-primary/10">
                          {input.expectedType === 'link' ? <Globe className="w-3 h-3 text-primary" /> : <FileText className="w-3 h-3 text-primary" />}
                        </div>
                        <span className="font-semibold text-foreground/80">{input.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter h-4 px-1 opacity-60">
                          {input.expectedType}
                        </Badge>
                        {input.isRequired && <span className="text-[9px] text-primary font-bold uppercase">Required</span>}
                      </div>
                    </div>
                  ))}
                  {(!selectedTemplate.template_inputs || selectedTemplate.template_inputs.length === 0) && (
                    <p className="text-[10px] text-muted-foreground italic pl-1">No execution context required</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <ArrowUpFromLine className="w-3 h-3" /> Artefacts
                </h4>
                <div className="space-y-2">
                  {(selectedTemplate.template_outputs || []).map((output) => (
                    <div key={output.id} className="flex justify-between items-center p-2.5 rounded-lg bg-muted/20 border border-primary/5 text-xs group hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-secondary/10">
                          <CheckCircle2 className="w-3 h-3 text-secondary" />
                        </div>
                        <span className="font-semibold text-foreground/80">{output.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter h-4 px-1 opacity-60">
                          {output.outputType || 'file'}
                        </Badge>
                        {output.isRequired && <span className="text-[9px] text-primary font-bold uppercase">Target</span>}
                      </div>
                    </div>
                  ))}
                  {(!selectedTemplate.template_outputs || selectedTemplate.template_outputs.length === 0) && (
                    <p className="text-[10px] text-muted-foreground italic pl-1">Standard execution output</p>
                  )}
                </div>
              </div>
            </section>

            {selectedTemplate.availability_workspace.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Availability
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.availability_workspace.map((wsId) => (
                    <Badge key={wsId} variant="outline" className="text-[10px] font-normal">
                      {wsId.replace("ws-", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <ListTodo className="w-3 h-3" /> Mandatory Checks
              </h4>
              <div className="space-y-2">
                {(selectedTemplate.template_checklist_items || []).map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/10 border border-primary/5 transition-colors hover:bg-muted/20">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${item.isCompleted ? 'text-primary' : 'text-muted-foreground/30'}`} />
                    <div className="space-y-1">
                      <p className={`text-xs font-semibold ${item.isCompleted ? 'text-foreground' : 'text-foreground/60'}`}>{item.label}</p>
                      {item.description && <p className="text-[10px] text-muted-foreground leading-relaxed">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <FileText className="w-3 h-3" /> Reference Document
              </h4>
              <div className="p-3 rounded-lg bg-background border font-mono text-[10px] break-all border-dashed opacity-70">
                {selectedTemplate.template_markdown_content}
              </div>
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 bg-primary hover:bg-primary/90">Instantiate SOP</Button>
              <Button variant="outline" className="hover:bg-primary/5">Edytuj Template</Button>
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
