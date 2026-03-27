"use client";

import React from "react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Trash2, Settings, Link as LinkIcon, Key, Zap, Activity, HelpCircle } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";

export type Provider = {
    readonly id: string;
    readonly title: string;
    readonly type: string;
    readonly schema: string;
    readonly models?: string;
    readonly apiKey: string;
    readonly pricing: string;
    readonly url?: string;
    readonly categories: readonly string[];
};

type LLMProviderSidePeekProps = {
  readonly provider: Provider | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfigure?: (provider: Provider) => void;
  readonly onDelete?: (id: string) => void;
}

export const LLMProviderSidePeek = ({ provider, isOpen, onClose, onConfigure, onDelete }: LLMProviderSidePeekProps) => {
  if (!provider) return null;

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={provider.title}
      description={
        <Badge variant="secondary" className="mt-1 font-bold text-[10px] uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-none">
            {provider.type}
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
              if (provider.id && onDelete) {
                onDelete(provider.id);
                onClose();
              }
            }}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 font-bold" 
            size="lg"
            onClick={() => onConfigure?.(provider)}
          >
            <Settings className="w-4 h-4 mr-2" /> Konfiguruj
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* ── Metadata Summary (Consistent with AgentProfilePeek) ── */}
        <div className="grid grid-cols-2 gap-4 pb-10 border-b border-muted">
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground">Schema</div>
            <div className="text-base font-bold">{provider.schema}</div>
          </div>
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground">Modele</div>
            <div className="text-base font-bold tracking-tight">
              {provider.models || "N/A"}
            </div>
          </div>
        </div>

        {/* ── Configuration Details ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Konfiguracja Połączenia
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          
          <div className="space-y-1.5">
            {provider.url && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-4 h-4 text-primary/60 shrink-0" />
                  <span className="text-base font-mono font-semibold truncate max-w-[200px]">{provider.url}</span>
                </div>
                <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold opacity-50">URL</Badge>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-primary/60 shrink-0" />
                <span className="text-base font-mono font-semibold">{provider.apiKey}</span>
              </div>
              <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold opacity-50">KEY</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-primary/60 shrink-0" />
                <span className="text-base font-semibold">{provider.pricing}</span>
              </div>
              <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold opacity-50">BILLING</Badge>
            </div>
          </div>
        </section>

        {/* ── Status Info ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground">
            Status Połączenia
          </h4>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-base font-normal border-green-500/20 text-green-500 bg-green-500/5">
              Aktywny i zweryfikowany
            </Badge>
          </div>
        </section>
      </div>
    </SidePeek>
  );
};
