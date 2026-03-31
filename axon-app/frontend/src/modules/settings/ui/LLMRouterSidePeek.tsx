"use client";

import React from "react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Trash2, Settings } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import type { LLMRouter } from "@/shared/domain/settings";

type LLMRouterSidePeekProps = {
  readonly router: LLMRouter | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfigure?: (router: LLMRouter) => void;
  readonly onDelete?: (id: string) => void;
  readonly getModelName: (id: string) => string;
}

export const LLMRouterSidePeek = ({
  router,
  isOpen,
  onClose,
  onConfigure,
  onDelete,
  getModelName
}: LLMRouterSidePeekProps) => {
  if (!router) return null;

  const strategy = router.router_strategy.toLowerCase();
  const isFallback = strategy.includes("fallback");
  const strategyLabel = strategy.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const chain = router.priority_chain && router.priority_chain.length > 0
    ? router.priority_chain
    : [
      { model_id: router.primary_model_id, error_timeout: 60 },
      ...(router.fallback_model_id ? [{ model_id: router.fallback_model_id, error_timeout: 30 }] : [])
    ];

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={router.router_alias}
      description={
        <Badge variant="secondary" className="mt-1 font-bold text-[12px] uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-none">
          {strategyLabel}
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
              if (router.id && onDelete) {
                onDelete(router.id);
                onClose();
              }
            }}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 font-bold"
            size="lg"
            onClick={() => onConfigure?.(router)}
          >
            <Settings className="w-4 h-4 mr-2" /> Konfiguruj
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* ── Models Visualization ── */}
        <section className="space-y-6">
          <h4 className="text-base font-bold text-muted-foreground">
            Modele w Routerze
          </h4>

          <div className="space-y-1.5">
            {chain.map((item: any, index: number) => (
              <div key={`${router.id}-step-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 text-base font-mono font-semibold">
                    {isFallback && (
                      <span className="text-primary/40 font-bold w-4">{index + 1}.</span>
                    )}
                    <span className="text-foreground">{getModelName(item.model_id)}</span>
                  </div>
                  <div className="text-[14px] font-bold text-muted-foreground/60">
                    On Error / Timeout &gt; {item.error_timeout >= 60 ? `${Math.floor(item.error_timeout / 60)}m` : `${item.error_timeout}s`}
                  </div>
                </div>
                <Badge variant="outline" className="text-[12px] h-5 px-2 py-0 font-bold uppercase tracking-wider opacity-50">
                  {isFallback ? (index === 0 ? "Primary" : "Fallback") : "Target"}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SidePeek>
  );
};
