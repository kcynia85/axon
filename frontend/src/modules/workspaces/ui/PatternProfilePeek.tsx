"use client";

import React from "react";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { HelpCircle, Layers } from "lucide-react";
import { Pattern } from "@/shared/domain/workspaces";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/ui/ui/Accordion";

type PatternProfilePeekProps = {
  readonly pattern: Pattern | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onInstantiate?: () => void;
}

const FALLBACK_COMPONENTS = [
  "Interview Analysis", 
  "Design Crew", 
  "User Researcher", 
  "PRD Template", 
  "Figma Sync", 
  "Slack Notify"
];

export const PatternProfilePeek = ({ pattern, isOpen, onClose, onInstantiate }: PatternProfilePeekProps) => {
  if (!pattern) return null;

  const patternNodes = pattern.pattern_graph_structure?.nodes 
    ? (typeof pattern.pattern_graph_structure.nodes === 'object' 
        ? Object.values(pattern.pattern_graph_structure.nodes) 
        : [])
    : [];

  const contextFields = Object.entries(pattern.pattern_inputs || {});
  const artefactFields = Object.entries(pattern.pattern_outputs || {});

  const allComponents = patternNodes.length > 0 ? patternNodes : FALLBACK_COMPONENTS;
  const visibleComponents = allComponents.slice(0, 3);
  const hiddenComponents = allComponents.slice(3);

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={pattern.pattern_name || "Pattern Details"}
      description={
        <Badge variant="secondary" className="text-[12px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none h-5 px-2 ">
          Pattern
        </Badge>
      }
      modal={false}
      footer={
        <Button className="w-full bg-primary hover:bg-primary/90 text-base py-6" onClick={onInstantiate}>
          Edytuj w Space
        </Button>
      }
    >
      <div className="space-y-12">
        {/* ── Main Description (OKR Context) ── */}
        {pattern.pattern_okr_context && (
          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-base leading-relaxed text-foreground/80 font-normal">
              {pattern.pattern_okr_context}
            </p>
          </div>
        )}

        {/* ── Keywords ── */}
        {pattern.pattern_keywords && pattern.pattern_keywords.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {pattern.pattern_keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-base font-normal">
                  #{kw}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* ── Components ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Components
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            {visibleComponents.map((comp) => (
              <div key={String(comp)} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-primary/5">
                <Layers className="w-4 h-4 text-primary/60 shrink-0" />
                <span className="text-base font-medium">{String(comp)}</span>
              </div>
            ))}
            
            {hiddenComponents.length > 0 && (
              <Accordion type="single" collapsible className="w-full border-none">
                <AccordionItem value="more-components" className="border-none">
                  <AccordionTrigger className="py-2 px-3 text-[14px] font-bold text-primary hover:no-underline justify-start gap-2 border-none">
                    + {hiddenComponents.length} More
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 space-y-1.5 border-none">
                    {hiddenComponents.map((comp) => (
                      <div key={String(comp)} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-primary/5">
                        <Layers className="w-4 h-4 text-primary/60 shrink-0" />
                        <span className="text-base font-medium">{String(comp)}</span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </section>

        {/* ── Context ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Context
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            {contextFields.length > 0 ? (
              contextFields.map(([name, type]) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold text-foreground">{name}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {String(type)}
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
            {artefactFields.length > 0 ? (
              artefactFields.map(([name, type]) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold text-foreground">{name}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {String(type)}
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

        {/* ── Shared with ── */}
        {pattern.availability_workspace && pattern.availability_workspace.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">
              Shared with
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {pattern.availability_workspace.map((wsId) => (
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
