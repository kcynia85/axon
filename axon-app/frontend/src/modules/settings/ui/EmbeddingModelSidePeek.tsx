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
    AlertTriangle
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { EmbeddingModel } from "@/shared/domain/settings";
import { CategoryChip } from "@/shared/ui/ui/CategoryChip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/ui/ui/Dialog";

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
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    if (!model) return null;

    const isMultimodal = model.model_id.toLowerCase().includes("multimodal") || model.model_id.toLowerCase().includes("vision");

    const handleDelete = () => {
        if (model.id && onDelete) {
            onDelete(model.id);
            setShowDeleteConfirm(false);
            onClose();
        }
    };

    return (
        <>
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
                            onClick={() => setShowDeleteConfirm(true)}
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
                        <div className="p-3 rounded-lg bg-muted/30 border border-primary/5 flex items-center gap-3">
                            <CategoryChip label={isMultimodal ? "Multimodal" : "Text"} />
                            <span className="opacity-70 font-normal text-sm text-zinc-400">(max {model.model_max_context_tokens} tokens)</span>
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
                                $ {model.model_cost_per_1m_tokens} <span className="opacity-70 font-normal text-sm ml-1 text-zinc-400">/ 1M tokenów</span>
                            </p>
                        </div>
                    </SidePeekSection>
                </div>
            </SidePeek>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-5 h-5" />
                            Usuwanie Modelu Embeddingu
                        </DialogTitle>
                        <DialogDescription className="py-4">
                            Czy na pewno chcesz usunąć model <strong className="text-foreground">{model.model_id}</strong>? 
                            Tej operacji nie można cofnąć.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                            Anuluj
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                        >
                            Tak, usuń model
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
