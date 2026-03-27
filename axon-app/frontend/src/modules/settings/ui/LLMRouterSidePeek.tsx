"use client";

import React from "react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Trash2, Settings, Network, Cpu, Zap, Activity, HelpCircle, ArrowRight } from "lucide-react";
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

  const strategyLabel = router.router_strategy.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={router.router_alias}
      description={
        <Badge variant="secondary" className="mt-1 font-bold text-[10px] uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-none">
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
        {/* ── Chain Visualization ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Łańcuch Wywołań
            <Network className="w-4 h-4 text-primary opacity-50" />
          </h4>
          
          <div className="space-y-3">
            {/* Primary Model */}
            <div className="relative p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-center gap-4 group">
                <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-mono text-xs font-bold shrink-0">
                    1
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-0.5">Primary Model</div>
                    <div className="text-base font-bold truncate">{getModelName(router.primary_model_id)}</div>
                </div>
                <Cpu className="w-5 h-5 text-primary opacity-20" />
            </div>

            {/* Fallback Indicator */}
            {router.fallback_model_id && (
                <div className="flex justify-center py-1">
                    <div className="flex flex-col items-center gap-1">
                        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter py-0 h-4 px-1.5 opacity-40">
                            On Failure
                        </Badge>
                        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                </div>
            )}

            {/* Fallback Model */}
            {router.fallback_model_id && (
                <div className="relative p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 font-mono text-xs font-bold shrink-0">
                        2
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Fallback Model</div>
                        <div className="text-base font-bold text-zinc-600 dark:text-zinc-400 truncate">
                            {getModelName(router.fallback_model_id)}
                        </div>
                    </div>
                    <Activity className="w-5 h-5 text-zinc-300 dark:text-zinc-700" />
                </div>
            )}
          </div>
        </section>

        {/* ── Constraints & Rules ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Reguły i Limity
            <Zap className="w-4 h-4 text-primary opacity-50" />
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max Tokens</div>
                <div className="text-lg font-mono font-bold">
                    {router.router_max_tokens_threshold?.toLocaleString() || "∞"}
                </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cost Limit</div>
                <div className="text-lg font-mono font-bold">
                    {router.router_cost_limit_per_request ? `$${router.router_cost_limit_per_request}` : "N/A"}
                </div>
            </div>
          </div>
        </section>

        {/* ── Status Info ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground">
            Wydajność
          </h4>
          <div className="space-y-2">
             <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Średni czas odpowiedzi</span>
                <span className="font-mono font-bold text-green-500">142ms</span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Wskaźnik sukcesu</span>
                <span className="font-mono font-bold text-green-500">99.8%</span>
             </div>
          </div>
        </section>
      </div>
    </SidePeek>
  );
};
