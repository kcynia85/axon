"use client";

import React from "react";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { HelpCircle, Edit2, Trash2 } from "lucide-react";
import { Template } from "@/shared/domain/workspaces";
import { cn } from "@/shared/lib/utils";

type TemplateProfilePeekProps = {
  readonly template: Template | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onInstantiate?: () => void;
  readonly onEdit?: () => void;
  readonly onDelete?: (id: string) => void;
}

export const TemplateProfilePeek = ({ template, isOpen, onClose, onEdit, onDelete }: TemplateProfilePeekProps) => {
  if (!template) return null;

  // Logic to determine if we should show numbering for actions with subactions
  const actionsWithSubactions = template.template_checklist_items.filter(
    item => item.subactions && item.subactions.length > 0
  );
  const showNumbering = actionsWithSubactions.length > 1;
  let currentGroupIndex = 0;

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={template.template_name || "Template Details"}
      description={
        <Badge variant="secondary" className="text-[12px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none h-5 px-2">
          Template
        </Badge>
      }
      modal={false}
      footer={
        <div className="flex w-full justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon-lg"
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
            onClick={() => {
              if (template.id && onDelete) {
                onDelete(template.id);
                onClose();
              }
            }}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 font-bold" 
            size="lg"
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4 mr-2" /> {template.id === "draft" ? "Kontynuuj projektowanie" : "Edytuj Szablon"}
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* ── Main Description ── */}
        {template.template_description && (
          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-base leading-relaxed text-foreground/80 font-normal">
              {template.template_description}
            </p>
          </div>
        )}

        {/* ── Keywords ── */}
        {template.template_keywords && template.template_keywords.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {template.template_keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-base font-normal">
                  #{kw}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* ── Actions (Hierarchical Checklist) ── */}
        {template.template_checklist_items && template.template_checklist_items.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
              Actions
              <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
            </h4>
            
            <div className="space-y-6">
              {template.template_checklist_items.map((item) => {
                const hasSubactions = item.subactions && item.subactions.length > 0;
                
                if (hasSubactions) {
                  currentGroupIndex++;
                  return (
                    <div key={item.id} className="space-y-3">
                      <div className="text-base font-bold text-foreground">
                        {showNumbering ? `${currentGroupIndex}. ` : ""}{item.label}
                      </div>
                      <div className="pl-4 space-y-3">
                        {item.subactions?.map(sub => (
                          <div key={sub.id} className="flex items-center gap-3">
                            <div className={cn(
                              "h-4 w-4 border rounded shrink-0",
                              sub.isCompleted ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                            )} /> 
                            <span className={cn(
                              "text-base text-foreground font-medium",
                              sub.isCompleted && "line-through opacity-50"
                            )}>
                              {sub.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className={cn(
                      "h-4 w-4 border rounded shrink-0",
                      item.isCompleted ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                    )} /> 
                    <span className={cn(
                      "text-base text-foreground font-medium",
                      item.isCompleted && "line-through opacity-50"
                    )}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Context ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Context
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            {template.template_inputs && template.template_inputs.length > 0 ? (
              template.template_inputs.map((input) => (
                <div key={input.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold text-foreground">{input.label}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {input.expectedType}
                  </Badge>
                </div>
              ))
            ) : (
              [
                ["research_brief", "pdf"],
                ["user_persona", "json"]
              ].map(([name, type]) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold text-foreground">{name}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {type}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Artefacts ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Artefacts
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            {template.template_outputs && template.template_outputs.length > 0 ? (
              template.template_outputs.map((output) => (
                <div key={output.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold text-foreground">{output.label}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {output.outputType}
                  </Badge>
                </div>
              ))
            ) : (
              [
                ["strategy_report", "md"],
                ["content_plan", "json"]
              ].map(([name, type]) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold text-foreground">{name}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {type}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Availability ── */}
        {template.availability_workspace && template.availability_workspace.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">
             Availability
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {template.availability_workspace.map((wsId) => (
                <Badge key={wsId} variant="outline" className="text-base font-normal">
                  {wsId.replace("ws-", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </SidePeek>
  );
};
