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
import { Badge } from "@/shared/ui/ui/Badge";

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

    const isMultimodal = model.model_id?.toLowerCase().includes("multimodal") || model.model_id?.toLowerCase().includes("vision") || false;

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
                title={model.model_id || "Embedding Model"}
                description={`${model.model_provider_name || "Unknown"} / Aktywny`}
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
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                            <div className="flex items-center gap-3">
                                <span className="text-base font-semibold text-white">{isMultimodal ? "Multimodal" : "Text"}</span>
                                <span className="text-xs text-zinc-500 font-mono">(max {model.model_max_context_tokens || 0})</span>
                            </div>
                            <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                                tokens
                            </Badge>
                        </div>
                    </SidePeekSection>

                    {/* ── Dimensions ── */}
                    <SidePeekSection title="Dimensions">
                        <div className="p-3 rounded-lg bg-muted/30 border border-primary/5 flex items-center justify-between">
                            <span className="text-base font-mono font-semibold text-white">
                                {model.model_vector_dimensions || "N/A"}
                            </span>
                        </div>
                    </SidePeekSection>

                    {/* ── Cost ── */}
                    <SidePeekSection title="Cost">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                            <span className="text-base font-semibold text-white">
                                $ {model.model_cost_per_1m_tokens || 0}
                            </span>
                            <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                                per 1m tokens
                            </Badge>
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
