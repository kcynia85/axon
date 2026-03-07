"use client";

import React from "react";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { HelpCircle, Layers } from "lucide-react";
import { Pattern } from "@/shared/domain/workspaces";

type PatternProfilePeekProps = {
  readonly pattern: Pattern | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onInstantiate?: () => void;
}

export const PatternProfilePeek = ({ pattern, isOpen, onClose, onInstantiate }: PatternProfilePeekProps) => {
  if (!pattern) return null;

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={pattern.pattern_name || "Pattern Details"}
      description={
        <Badge variant="secondary" className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none h-5 px-2">
          {pattern.pattern_type}
        </Badge>
      }
      modal={false}
      footer={
        <Button className="w-full bg-primary hover:bg-primary/90 text-base py-6" onClick={onInstantiate}>
          Edytuj Pattern
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

        {/* ── Metadata Summary ── */}
        <div className="pb-10 border-b border-muted">
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground">Category</div>
            <div className="text-base font-bold">Architectural Pattern</div>
          </div>
        </div>

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
          <div className="grid grid-cols-2 gap-3">
            {["Template", "Crew", "Agent", "Logic"].map((comp) => (
              <div key={comp} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-primary/5">
                <Layers className="w-4 h-4 text-primary/60 shrink-0" />
                <span className="text-base font-medium">{comp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Availability ── */}
        {pattern.availability_workspace && pattern.availability_workspace.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">
              Availability
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
