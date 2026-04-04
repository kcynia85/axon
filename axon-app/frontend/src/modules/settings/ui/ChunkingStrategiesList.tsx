"use client";

import * as React from "react";
import { useChunkingStrategies, useDeleteChunkingStrategy } from "../application/useSettings";
import { Card, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Scissors, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { ChunkingStrategySidePeek } from "./ChunkingStrategySidePeek";
import type { ChunkingStrategy } from "@/shared/domain/settings";
import { useChunkingStrategyDraft } from "@/modules/studio/features/chunking-studio/application/hooks/useChunkingStrategyDraft";
import { toast } from "sonner";
import { CategoryChip } from "@/shared/ui/ui/CategoryChip";

const formatMethodName = (method: string) => {
    return method.replace(/_/g, " ");
};

export const ChunkingStrategiesList = () => {
    const { data: strategies, isLoading } = useChunkingStrategies();
    const { mutateAsync: deleteStrategy } = useDeleteChunkingStrategy();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const router = useRouter();

    // Local Drafts (Workspace Pattern)
    const { draft: newDraft, clearDraft: clearNewDraft } = useChunkingStrategyDraft("new");

    const [selectedStrategy, setSelectedStrategy] = React.useState<ChunkingStrategy | null>(null);

    const handleDelete = (id: string, name: string) => {
        deleteWithUndo(id, name, () => deleteStrategy(id));
        setSelectedStrategy(null);
    };

    const handleDiscardDraft = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Czy na pewno chcesz odrzucić ten szkic?")) {
            clearNewDraft();
            toast.success("Szkic odrzucony");
        }
    };

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((index) => (
                    <Card key={index} className="h-32 w-full rounded-xl">
                        <CardContent className="p-5 flex items-start gap-4">
                            <Skeleton className="w-10 h-10 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const displayStrategies = strategies?.filter(s => !pendingIds.has(s.id)) || [];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* NEW DRAFT GHOST CARD */}
                {newDraft && (
                    <Card 
                        className="group transition-all flex flex-col overflow-hidden border-2 border-dashed border-primary/20 bg-primary/5 hover:border-primary/40 cursor-pointer h-full relative"
                        onClick={() => router.push("/settings/knowledge-engine/chunking/new")}
                    >
                        <CardContent className="pt-1 pb-4 flex items-start gap-4">
                            <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary mt-4">
                                <Plus className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0 flex-1 pt-4">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="text-base font-bold tracking-tight truncate leading-none mt-0.5 text-primary/80">
                                        {newDraft.strategy_name || "Nowa Strategia (Szkic)"}
                                    </h3>
                                    <Badge variant="outline" className="text-[8px] h-4 px-1.5 font-black uppercase tracking-widest border-primary/30 bg-primary/10 text-primary">
                                        SZKIC LOKALNY
                                    </Badge>
                                </div>
                                <div className="text-xs font-medium text-primary/60">
                                    {newDraft.strategy_chunking_method ? formatMethodName(newDraft.strategy_chunking_method) : "Nie wybrano metody"}
                                </div>
                                <div className="pt-2">
                                    <CategoryChip label="Kliknij aby kontynuować" className="bg-primary/10 text-primary border-primary/20" />
                                </div>
                            </div>
                            <button 
                                onClick={handleDiscardDraft}
                                className="absolute top-2 right-2 p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </CardContent>
                    </Card>
                )}

                {displayStrategies.map((strategy) => {
                    const isSemantic = strategy.strategy_chunking_method === "Semantic";
                    
                    return (
                        <Card 
                            key={strategy.id} 
                            className="group hover:border-primary/50 transition-all flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md cursor-pointer h-full"
                            onClick={() => setSelectedStrategy(strategy)}
                        >
                            <CardContent className="pt-1 pb-4 flex items-start gap-4">
                                <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary mt-4">
                                    <Scissors className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-1 min-w-0 flex-1 pt-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-base font-bold tracking-tight truncate leading-none mt-0.5">{strategy.strategy_name}</h3>
                                        {strategy.is_draft && (
                                            <Badge variant="outline" className="text-[8px] h-4 px-1.5 font-black uppercase tracking-widest border-amber-500/20 bg-amber-500/5 text-amber-500 shrink-0">
                                                Szkic
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-xs font-medium text-zinc-400">
                                        {formatMethodName(strategy.strategy_chunking_method)}
                                    </div>
                                    <div className="pt-2 flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-zinc-500">
                                            {strategy.strategy_chunk_size}
                                            {!isSemantic && ` / ${strategy.strategy_chunk_overlap}`}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {displayStrategies.length === 0 && !newDraft && (
                    <div className="col-span-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 space-y-2">
                        <Scissors className="w-8 h-8 opacity-20" />
                        <span className="text-xs font-medium">No chunking strategies found</span>
                    </div>
                )}
            </div>

            <ChunkingStrategySidePeek 
                strategy={selectedStrategy}
                isOpen={!!selectedStrategy}
                onClose={() => setSelectedStrategy(null)}
                onEdit={(strategy) => router.push(`/settings/knowledge-engine/chunking/${strategy.id}`)}
                onDelete={(id) => handleDelete(id, selectedStrategy?.strategy_name || "Strategy")}
            />
        </div>
    );
};
