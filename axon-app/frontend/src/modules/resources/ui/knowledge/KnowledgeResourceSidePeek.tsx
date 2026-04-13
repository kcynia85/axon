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
    FileText, 
    Database, 
    Layers,
    Tag,
    Info,
    Trash2
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { Badge } from "@/shared/ui/ui/Badge";
import { Loader2 } from "lucide-react";

type KnowledgeResourceSidePeekProps = {
  readonly resourceId: string | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onDelete?: (id: string) => void;
}

export const KnowledgeResourceSidePeek = ({ 
    resourceId, 
    isOpen, 
    onClose,
    onDelete
}: KnowledgeResourceSidePeekProps) => {
    
    const { data: resource, isLoading } = useQuery({
        queryKey: ["knowledge-source", resourceId],
        queryFn: () => resourceId ? resourcesApi.getKnowledgeResource(resourceId) : Promise.reject("No ID"),
        enabled: !!resourceId && isOpen,
    });

    const { data: chunks = [], isLoading: isLoadingChunks } = useQuery({
        queryKey: ["knowledge-source-chunks", resourceId],
        queryFn: () => resourceId ? resourcesApi.getKnowledgeResourceChunks(resourceId) : Promise.resolve([]),
        enabled: !!resourceId && isOpen && resource?.resource_rag_indexing_status?.toLowerCase() === "ready",
    });

    if (!isOpen) return null;

    return (
        <SidePeek
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title={resource?.resource_file_name || "Szczegóły Zasobu"}
            description={
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        {resource?.resource_file_format || "DOCUMENT"}
                    </span>
                </div>
            }
            modal={true}
            image={
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
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
            ) : resource ? (
                <div className="space-y-12">
                    {/* ── Metadata Summary (Status Only) ── */}
                    <SidePeekGrid>
                        <SidePeekGridItem 
                            label="Status Indeksacji" 
                            value={
                                <Badge 
                                    className={cn(
                                        "font-mono text-[14px] normal-case bg-white text-black hover:bg-white/90",
                                    )}
                                >
                                    {resource.resource_rag_indexing_status}
                                </Badge>
                            } 
                        />
                    </SidePeekGrid>

                    {/* ── Vector Store Info ── */}
                    <SidePeekSection title="Baza Wektorowa">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-primary/5">
                            <div className="flex-1 min-w-0 px-1">
                                <div className="text-base font-semibold text-white truncate">
                                    {resource.vector_database_name || "Domyślna baza"}
                                </div>
                            </div>
                        </div>
                    </SidePeekSection>

                    {/* ── Chunk Count (Separate Section) ── */}
                    <SidePeekSection title="Chunk Count">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                            
                            <span className="text-base font-mono font-semibold text-white">{resource.resource_chunk_count || 0}</span>
                        </div>
                    </SidePeekSection>

                    {/* ── Chunks Content ── */}
                    {resource.resource_rag_indexing_status === "Ready" && (
                        <SidePeekSection title={`Treść Zasobu (${chunks.length} fragmentów)`}>
                            <div className="space-y-4">
                                {isLoadingChunks ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                                    </div>
                                ) : chunks.length > 0 ? (
                                    chunks.map((chunk: any, idx: number) => (
                                        <div key={chunk.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Fragment #{idx + 1}</span>
                                                <span className="text-[10px] font-mono text-zinc-600 italic">{chunk.chunk_token_count || '???'} tokens</span>
                                            </div>
                                            <p className="text-sm text-zinc-300 leading-relaxed line-clamp-6 whitespace-pre-wrap">
                                                {chunk.chunk_text}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground italic text-center py-4">Brak fragmentów tekstu w bazie.</div>
                                )}
                            </div>
                        </SidePeekSection>
                    )}

                    {/* ── Metadata (JSONB) ── */}
                    <SidePeekSection title="Metadane (JSONB)">
                        <div className="space-y-1.5">
                            {Object.entries(resource.resource_metadata || {}).length > 0 ? (
                                Object.entries(resource.resource_metadata).map(([key, value]) => (
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
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground italic pl-1 text-center py-4">Brak dodatkowych metadanych.</div>
                            )}
                        </div>
                    </SidePeekSection>

                    {/* ── Tags ── */}
                    {((resource.resource_metadata?.auto_tags?.length > 0) || (resource.resource_metadata?.tags?.length > 0)) && (
                        <SidePeekSection title="Tagi">
                            <div className="flex flex-wrap gap-1.5">
                                {[...(resource.resource_metadata?.tags || []), ...(resource.resource_metadata?.auto_tags || [])].map((tag: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-base font-normal">
                                        #{tag.toLowerCase()}
                                    </Badge>
                                ))}
                            </div>
                        </SidePeekSection>
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
