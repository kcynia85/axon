"use client";

import React from "react";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { LayoutGrid, ShieldCheck, Tag, Edit2, Trash2 } from "lucide-react";

type PatternProfilePeekProps = {
  readonly pattern: any; // Type should be WorkflowPattern from domain
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onInstantiate: () => void;
};

export const PatternProfilePeek = ({
  pattern,
  isOpen,
  onClose,
  onInstantiate,
}: PatternProfilePeekProps) => {
  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={pattern?.pattern_name || "Pattern Details"}
      description="Optimized Process Flow"
      modal={false}
      image={
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-black flex items-center justify-center text-primary">
          <LayoutGrid className="w-6 h-6" />
        </div>
      }
      footer={
        <div className="flex w-full justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon-lg"
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
            onClick={() => {
              // TODO: Implement delete logic if needed
              onClose();
            }}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 font-bold" 
            size="lg"
            onClick={onInstantiate}
          >
            Use This Pattern
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* ── 1. Description Block ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground">Strategic Context</h4>
          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-base leading-relaxed text-foreground/80 font-normal italic">
              &quot;{pattern?.pattern_okr_context || "This pattern defines a high-efficiency workflow for specific business objectives."}&quot;
            </p>
          </div>
        </section>

        {/* ── 2. Metadata Grid ── */}
        <div className="grid grid-cols-2 gap-4 pb-10 border-b border-muted">
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-muted-foreground/50" /> Governance
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm font-bold bg-blue-500/10 text-blue-600 border-none px-2">Validated</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground/50" /> Type
            </div>
            <div className="text-base font-bold text-foreground">Workflow</div>
          </div>
        </div>

        {/* ── 3. Components Summary ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground">Architectural Nodes</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
              <span className="text-base font-medium">Defined Steps</span>
              <span className="text-base font-bold">{pattern?.pattern_steps?.length || 0}</span>
            </div>
          </div>
        </section>
      </div>
    </SidePeek>
  );
};
