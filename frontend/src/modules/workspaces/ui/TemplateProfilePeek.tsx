"use client";

import React from "react";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { HelpCircle } from "lucide-react";
import { Template } from "@/shared/domain/workspaces";
import { cn } from "@/shared/lib/utils";

type TemplateProfilePeekProps = {
  readonly template: Template | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: () => void;
}

export const TemplateProfilePeek = ({ template, isOpen, onClose, onEdit }: TemplateProfilePeekProps) => {
  if (!template) return null;

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={template.template_name || "Template Details"}
      description={
        <Badge variant="secondary" className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none h-5 px-2">
          {template.template_type}
        </Badge>
      }
      modal={false}
      footer={
        <Button className="w-full bg-primary hover:bg-primary/90 text-base py-6" onClick={onEdit}>
          Edytuj Template
        </Button>
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

        {/* ── Metadata Summary ── */}
        <div className="pb-10 border-b border-muted">
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground">Type</div>
            <div className="text-base font-bold">{template.template_type}</div>
          </div>
        </div>

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

        {/* ── Instruction (Markdown) ── */}
        {template.template_markdown_content && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
              Instruction
              <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
            </h4>
            <div className="text-base font-mono bg-muted/30 p-4 rounded-lg border border-primary/5 overflow-x-auto whitespace-pre-wrap">
              {template.template_markdown_content}
            </div>
          </section>
        )}

        {/* ── Actions (To-Do) ── */}
        {template.template_checklist_items && template.template_checklist_items.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
              Actions
              <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
            </h4>
            <ul className="space-y-2 text-base">
              {template.template_checklist_items.map(item => (
                <li key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <div className={cn(
                    "h-4 w-4 border rounded shrink-0",
                    item.isCompleted ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                  )} /> 
                  <span className={cn(
                    "text-foreground/80",
                    item.isCompleted && "line-through opacity-50"
                  )}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

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
