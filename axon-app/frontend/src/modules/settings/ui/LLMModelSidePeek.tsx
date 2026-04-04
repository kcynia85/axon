"use client";

import React from "react";
import { 
    SidePeek, 
    SidePeekSection, 
    SidePeekGrid, 
    SidePeekGridItem 
} from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Trash2, Settings, Zap, BarChart3, AlertTriangle } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import { CategoryChip } from "@/shared/ui/ui/CategoryChip";
import type { LLMModel } from "@/shared/domain/settings";
import { useLLMModelUsage } from "../application/useSettings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/ui/ui/Dialog";

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
    const { data: usage, isLoading: isLoadingUsage } = useLLMModelUsage(model?.id || "");
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    if (!model) return null;

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
                title={model.model_display_name || "Internal"}
                description={providerName}
                modal={false}
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
                            <Settings className="w-4 h-4 mr-2" /> Edytuj Model
                        </Button>
                    </div>
                }
            >
                <div className="space-y-12">
                    {/* ── Context ── */}
                    <SidePeekGrid>
                        <SidePeekGridItem 
                            label="Context Window" 
                            value={`${model.model_context_window.toLocaleString()} tokens`} 
                        />
                        <SidePeekGridItem 
                            label="Tier" 
                            value={model.model_tier} 
                        />
                    </SidePeekGrid>

                    {/* ── Pricing ── */}
                    <SidePeekSection title="Cennik (za 1M tokenów)">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between">
                                <div className="text-base text-muted-foreground font-bold">Input</div>
                                <div className="text-base font-bold">
                                    ${((model.model_pricing_config.input as number) || 0).toFixed(2)}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-base text-muted-foreground font-bold">Output</div>
                                <div className="text-base font-bold">
                                    ${((model.model_pricing_config.output as number) || 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </SidePeekSection>

                    {/* ── Capabilities ── */}
                    <SidePeekSection title="Możliwości Modelu">
                        <div className="flex flex-wrap gap-2">
                            {model.model_capabilities_flags.map((cap, i) => (
                                <CategoryChip key={i} label={cap} />
                            ))}
                            {model.model_supports_thinking && (
                                <CategoryChip label="THINKING" className="bg-purple-500/10 text-purple-500 border-purple-500/20" />
                            )}
                        </div>
                    </SidePeekSection>
                </div>
            </SidePeek>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-5 h-5" />
                            Usuwanie Modelu
                        </DialogTitle>
                        <DialogDescription className="py-4">
                            Czy na pewno chcesz usunąć model <strong className="text-foreground">{model.model_display_name}</strong>? 
                            Tej operacji nie można cofnąć.
                        </DialogDescription>
                    </DialogHeader>

                    {usage?.is_used && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                            <div className="text-amber-600 font-bold text-sm flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                Model jest w użyciu!
                            </div>
                            <div className="text-xs text-amber-700/80 space-y-1">
                                Ten model jest obecnie wykorzystywany w następujących miejscach:
                                <ul className="list-disc list-inside mt-2 font-semibold">
                                    {usage.used_by.map((u: string, i: number) => (
                                        <li key={i}>{u}</li>
                                    ))}
                                </ul>
                                <p className="mt-3 opacity-90">
                                    Usunięcie modelu spowoduje wyczyszczenie tych referencji, co może wpłynąć na działanie routerów.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                            Anuluj
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={isLoadingUsage}
                        >
                            Tak, usuń model
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
