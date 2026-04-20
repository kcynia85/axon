"use client";

import React, { useState } from "react";
import { 
    SidePeek, 
    SidePeekGrid, 
    SidePeekGridItem 
} from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { 
    FileText, 
    Info,
    Trash2,
    Loader2,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { Badge } from "@/shared/ui/ui/Badge";

type KnowledgeResourceSidePeekProps = {
  readonly resourceId: string | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onDelete?: (resourceId: string) => void;
}

/**
 * KnowledgeResourceSidePeek: Detailed view for a knowledge resource.
 * Standard: Pure View, 0% manual optimization.
 * Styles matched with ServiceProfilePeek.
 */
export const KnowledgeResourceSidePeek = ({ 
    resourceId, 
    isOpen, 
    onClose,
    onDelete
}: KnowledgeResourceSidePeekProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const { data: knowledgeResource, isLoading } = useQuery({
        queryKey: ["knowledge-source", resourceId],
        queryFn: () => resourceId ? resourcesApi.getKnowledgeResource(resourceId) : Promise.reject("No ID"),
        enabled: !!resourceId && isOpen,
    });

    const { data: resourceChunks = [], isLoading: isLoadingChunks } = useQuery({
        queryKey: ["knowledge-source-chunks", resourceId],
        queryFn: () => resourceId ? resourcesApi.getKnowledgeResourceChunks(resourceId) : Promise.resolve([]),
        enabled: !!resourceId && isOpen && (knowledgeResource?.resource_rag_indexing_status === "Ready" || knowledgeResource?.resource_rag_indexing_status === "READY"),
    });

    if (!isOpen) return null;

    const totalChunks = knowledgeResource?.resource_chunk_count || resourceChunks.length;

    return (
        <SidePeek
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title={knowledgeResource?.resource_file_name || "Szczegóły Zasobu"}
            description={
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        {knowledgeResource?.resource_file_format || "DOCUMENT"}
                    </span>
                </div>
            }
            modal={true}
            image={
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-black flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                </div>
            }
            footer={
                <div className="flex w-full justify-between items-center">
                    <Button 
                        variant="ghost" 
                        size="icon-lg"
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
                        onClick={() => resourceId && onDelete?.(resourceId)}
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="lg"
                        className="font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                        onClick={onClose}
                    >
                        Zamknij
                    </Button>
                </div>
            }
        >
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Ładowanie danych...</span>
                </div>
            ) : knowledgeResource ? (
                <div className="space-y-12">
                    {/* ── Metadata Summary ── */}
                    <SidePeekGrid>
                        <SidePeekGridItem 
                            label="Przypisany Hub" 
                            value={
                                <Badge 
                                    className="font-bold bg-white text-black hover:bg-white/90"
                                >
                                    {knowledgeResource.knowledge_hub_name || "Brak Hubu"}
                                </Badge>
                            } 
                        />
                    </SidePeekGrid>

                    {/* ── Vector Store Info ── */}
                    <section className="space-y-2">
                        <h4 className="text-base font-bold text-muted-foreground">Baza Wektorowa</h4>
                        <div className="text-base font-bold text-foreground">
                            {knowledgeResource.vector_database_name || "Domyślna baza"}
                        </div>
                    </section>

                    {/* ── Chunks Content ── */}
                    <section className="space-y-4">
                        <h4 className="text-base font-bold text-muted-foreground">
                            Treść Zasobu ({totalChunks} fragmentów)
                        </h4>
                        <div className="space-y-1.5">
                            {isLoadingChunks ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                                </div>
                            ) : resourceChunks.length > 0 ? (
                                <>
                                    {resourceChunks
                                        .slice(0, isExpanded ? undefined : 4)
                                        .map((chunk, index) => (
                                            <div key={chunk.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Fragment #{index + 1}</span>
                                                    <span className="text-[10px] font-mono text-zinc-600 italic">tokens: ~{Math.ceil(chunk.chunk_text.length / 4)}</span>
                                                </div>
                                                <p className="text-sm text-zinc-300 leading-relaxed line-clamp-6 whitespace-pre-wrap">
                                                    {chunk.chunk_text}
                                                </p>
                                            </div>
                                        ))}
                                    
                                    {resourceChunks.length > 4 && (
                                        <button
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground mt-2 transition-colors focus:outline-none"
                                        >
                                            {isExpanded ? (
                                                <>Pokaż Mniej <ChevronUp className="w-4 h-4" /></>
                                            ) : (
                                                <>+ {resourceChunks.length - 4} Więcej <ChevronDown className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="text-sm text-muted-foreground italic py-4">Brak fragmentów tekstu w bazie.</div>
                            )}
                        </div>
                    </section>

                    {/* ── Metadata (JSONB) ── */}
                    <section className="space-y-4">
                        <h4 className="text-base font-bold text-muted-foreground">Metadane (JSONB)</h4>
                        <div className="space-y-1.5">
                            {Object.entries(knowledgeResource.resource_metadata || {}).length > 0 ? (
                                Object.entries(knowledgeResource.resource_metadata).map(([key, value]) => {
                                    if (key === 'tags' || key === 'auto_tags') return null;
                                    return (
                                        <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                                            <span className="text-base font-medium text-white lowercase">
                                                {Array.isArray(value) 
                                                    ? value.join(', ') 
                                                    : typeof value === 'object' 
                                                        ? JSON.stringify(value).replace(/["\[\]]/g, '') 
                                                        : String(value)}
                                            </span>
                                            <Badge variant="outline" className="text-xs font-mono lowercase bg-zinc-800 text-zinc-300 border-zinc-700">
                                                {key}
                                            </Badge>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-sm text-muted-foreground italic text-center py-4">Brak dodatkowych metadanych.</div>
                            )}
                        </div>
                    </section>

                    {/* ── Tags ── */}
                    {((knowledgeResource.resource_metadata?.auto_tags?.length > 0) || (knowledgeResource.resource_metadata?.tags?.length > 0)) && (
                        <section className="space-y-4">
                            <h4 className="text-base font-bold text-muted-foreground">Tagi</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {[...(knowledgeResource.resource_metadata?.tags || []), ...(knowledgeResource.resource_metadata?.auto_tags || [])].map((tag: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-base font-normal">
                                        #{tag.toLowerCase()}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Info className="w-8 h-8 text-zinc-700 mb-2" />
                    <p className="text-zinc-500 text-sm">Nie udało się pobrać danych zasobu.</p>
                </div>
            )}
        </SidePeek>
    );
};
