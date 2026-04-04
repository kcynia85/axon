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
    Scissors, 
    Settings, 
    Trash2,
    AlertTriangle,
    Layers,
    Binary
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ChunkingStrategy } from "@/shared/domain/settings";
import { CategoryChip } from "@/shared/ui/ui/CategoryChip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/ui/ui/Dialog";
import { Badge } from "@/shared/ui/ui/Badge";

type ChunkingStrategySidePeekProps = {
  readonly strategy: ChunkingStrategy | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: (strategy: ChunkingStrategy) => void;
  readonly onDelete?: (id: string) => void;
}

const formatMethodName = (method: string) => {
    return method.replace(/_/g, " ");
};

export const ChunkingStrategySidePeek = ({ 
    strategy, 
    isOpen, 
    onClose, 
    onEdit, 
    onDelete 
}: ChunkingStrategySidePeekProps) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    if (!strategy) return null;

    const handleDelete = () => {
        if (strategy.id && onDelete) {
            onDelete(strategy.id);
            setShowDeleteConfirm(false);
            onClose();
        }
    };

    const isTokenBased = strategy.strategy_chunking_method === "Token_Splitter";
    const isSemantic = strategy.strategy_chunking_method === "Semantic";
    const separators = (strategy.strategy_chunk_boundaries as any)?.separators || [];

    return (
        <>
            <SidePeek
                open={isOpen}
                onOpenChange={(open) => !open && onClose()}
                title={strategy.strategy_name}
                description={formatMethodName(strategy.strategy_chunking_method)}
                modal={false}
                image={
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Scissors className="w-6 h-6" />
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
                            onClick={() => onEdit?.(strategy)}
                        >
                            <Settings className="w-4 h-4 mr-2" /> Konfiguruj Strategię
                        </Button>
                    </div>
                }
            >
                <div className="space-y-12">
                    {/* ── Method ── */}
                    <SidePeekSection title="Metoda Podziału">
                        <div className="p-3 rounded-lg bg-muted/30 border border-primary/5 flex items-center gap-3">
                            <CategoryChip label={formatMethodName(strategy.strategy_chunking_method)} />
                            {strategy.is_draft && (
                                <Badge variant="outline" className="text-[10px] h-5 px-2 font-black uppercase tracking-widest border-amber-500/20 bg-amber-500/5 text-amber-500">
                                    Szkic
                                </Badge>
                            )}
                        </div>
                    </SidePeekSection>

                    {/* ── Size & Overlap ── */}
                    <SidePeekGrid>
                        <SidePeekGridItem 
                            label={isTokenBased ? "Chunk Size (Tokens)" : "Chunk Size (Chars)"} 
                            value={
                                <div className="flex items-center gap-2">
                                    <Binary className="w-4 h-4 text-zinc-500" />
                                    <span className="text-base font-mono font-bold text-white">{strategy.strategy_chunk_size}</span>
                                </div>
                            } 
                        />
                        {!isSemantic && (
                            <SidePeekGridItem 
                                label="Overlap" 
                                value={
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-zinc-500" />
                                        <span className="text-base font-mono font-bold text-white">{strategy.strategy_chunk_overlap}</span>
                                    </div>
                                } 
                            />
                        )}
                    </SidePeekGrid>

                    {/* ── Separators ── */}
                    {separators.length > 0 && (
                        <SidePeekSection title="Separatory">
                            <div className="flex flex-wrap gap-2">
                                {separators.map((sep: string, i: number) => (
                                    <Badge key={i} variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 font-mono">
                                        {sep === "\n" ? "\\n" : sep === "\n\n" ? "\\n\\n" : sep === " " ? "SPACE" : sep}
                                    </Badge>
                                ))}
                            </div>
                        </SidePeekSection>
                    )}
                </div>
            </SidePeek>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-5 h-5" />
                            Usuwanie Strategii
                        </DialogTitle>
                        <DialogDescription className="py-4">
                            Czy na pewno chcesz usunąć strategię <strong className="text-foreground">{strategy.strategy_name}</strong>? 
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
                            Tak, usuń strategię
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
