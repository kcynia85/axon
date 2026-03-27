"use client";

import React from "react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Trash2, Settings, Cpu, Zap, Activity, HelpCircle, BarChart3, Database } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import type { LLMModel } from "@/shared/domain/settings";

type LLMModelSidePeekProps = {
  readonly model: LLMModel | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: (model: LLMModel) => void;
  readonly onDelete?: (id: string) => void;
  readonly providerName?: string;
}

export const LLMModelSidePeek = ({ 
    model, 
    isOpen, 
    onClose, 
    onEdit, 
    onDelete,
    providerName
}: LLMModelSidePeekProps) => {
  if (!model) return null;

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={model.model_display_name}
      description={
        <div className="flex flex-col gap-1 mt-1">
            <div className="text-[10px] font-mono opacity-60 uppercase tracking-tighter">
                {model.model_id}
            </div>
            <Badge variant="outline" className="w-fit font-bold text-[10px] uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-none">
                {model.model_tier}
            </Badge>
        </div>
      }
      modal={false}
      footer={
        <div className="flex w-full justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon-lg"
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
            onClick={() => {
              if (model.id && onDelete) {
                onDelete(model.id);
                onClose();
              }
            }}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 font-bold" 
            size="lg"
            onClick={() => onEdit?.(model)}
          >
            <Settings className="w-4 h-4 mr-2" /> Edytuj Model
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* ── Context & Provider ── */}
        <section className="grid grid-cols-2 gap-4 pb-10 border-b border-muted">
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground flex items-center gap-2">
                <Database className="w-4 h-4 opacity-50" /> Provider
            </div>
            <div className="text-base font-bold">{providerName || "Internal"}</div>
          </div>
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 opacity-50" /> Context
            </div>
            <div className="text-base font-bold tabular-nums">
              {model.model_context_window.toLocaleString()} tokens
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Cennik (za 1M tokenów)
            <BarChart3 className="w-4 h-4 text-primary opacity-50" />
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Input</div>
                <div className="text-lg font-mono font-bold">
                    ${((model.model_pricing_config.input as number) || 0).toFixed(2)}
                </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Output</div>
                <div className="text-lg font-mono font-bold">
                    ${((model.model_pricing_config.output as number) || 0).toFixed(2)}
                </div>
            </div>
          </div>
        </section>

        {/* ── Capabilities ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Możliwości Modelu
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="flex flex-wrap gap-2">
            {model.model_capabilities_flags.map((cap, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                    {cap}
                </Badge>
            ))}
            {model.model_supports_thinking && (
                <Badge className="px-3 py-1 bg-purple-500/10 text-purple-500 border-purple-500/20 font-bold">
                    THINKING
                </Badge>
            )}
          </div>
        </section>
      </div>
    </SidePeek>
  );
};
