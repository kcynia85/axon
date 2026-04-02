"use client";

import React from "react";
import { 
    SidePeek, 
    SidePeekSection, 
    SidePeekGrid, 
    SidePeekGridItem 
} from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { 
    Cpu, 
    Settings, 
    Trash2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { EmbeddingModel } from "@/shared/domain/settings";

type EmbeddingModelSidePeekProps = {
  readonly model: EmbeddingModel | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: (model: EmbeddingModel) => void;
  readonly onDelete?: (id: string) => void;
}

export const EmbeddingModelSidePeek = ({ 
    model, 
    isOpen, 
    onClose, 
    onEdit, 
    onDelete 
}: EmbeddingModelSidePeekProps) => {
    if (!model) return null;

    return (
        <SidePeek
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title={model.model_id}
            description={`${model.model_provider_name} / Aktywny`}
            modal={false}
            image={
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Cpu className="w-6 h-6" />
                </div>
            }
            footer={
                <div className="flex w-full justify-between items-center">
                    <Button 
                        variant="ghost" 
                        size="icon-lg"
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
                        onClick={() => onDelete?.(model.id)}
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                    <Button 
                        className="bg-primary hover:bg-primary/90 font-bold" 
                        size="lg"
                        onClick={() => onEdit?.(model)}
                    >
                        <Settings className="w-4 h-4 mr-2" /> Konfiguruj Model
                    </Button>
                </div>
            }
        >
            <div className="space-y-12">
                {/* ── Input ── */}
                <SidePeekSection title="Input">
                    <div className="p-3 rounded-lg bg-muted/30 border border-primary/5">
                        <p className="text-base font-semibold text-white">
                            Text <span className="opacity-70 font-normal text-sm ml-1">(max {model.model_max_context_tokens} tokens)</span>
                        </p>
                    </div>
                </SidePeekSection>

                {/* ── Dimensions ── */}
                <SidePeekSection title="Dimensions">
                    <div className="p-3 rounded-lg bg-muted/30 border border-primary/5">
                        <p className="text-base font-mono font-semibold text-white">
                            {model.model_vector_dimensions}
                        </p>
                    </div>
                </SidePeekSection>

                {/* ── Cost ── */}
                <SidePeekSection title="Cost">
                    <div className="p-3 rounded-lg bg-muted/30 border border-primary/5">
                        <p className="text-base font-semibold text-white">
                            $ {model.model_cost_per_1m_tokens} <span className="opacity-70 font-normal text-sm ml-1">/ 1M tokenów</span>
                        </p>
                    </div>
                </SidePeekSection>
            </div>
        </SidePeek>
    );
};
