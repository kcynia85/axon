import React from "react";
import { FileText, FileJson, FileCode, File, Database, Coins, Hash, FileQuestion } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ResourceFileInfoCardProps {
    fileName: string | null;
    fileSize: string | null;
    tokenCount?: number;
    estimatedCost?: number;
    selectedHubs?: string[];
    className?: string;
}

/**
 * ResourceFileInfoCard: Displays key business and technical information about a knowledge resource.
 * Replaces the technical Chunk Inspector for a more business-oriented view.
 * Standard: Pure View, Axon Minimalist Aesthetic.
 * Always visible to maintain UI structure.
 */
export const ResourceFileInfoCard = ({
    fileName,
    fileSize,
    tokenCount = 0,
    estimatedCost = 0,
    selectedHubs = [],
    className
}: ResourceFileInfoCardProps) => {
    
    const getFileIcon = (name: string | null) => {
        if (!name) return <FileQuestion className="w-8 h-8 text-zinc-700" />;
        
        const ext = name.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'json': return <FileJson className="w-8 h-8 text-amber-500" />;
            case 'md':
            case 'markdown': return <FileText className="w-8 h-8 text-primary" />;
            case 'pdf': return <File className="w-8 h-8 text-red-500" />;
            default: return <FileText className="w-8 h-8 text-primary" />;
        }
    };

    const formatCost = (cost: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 6,
            maximumFractionDigits: 8,
        }).format(cost);
    };

    const hubLabel = selectedHubs.length > 0 
        ? selectedHubs.join(", ") 
        : fileName ? "Zasób bez przypisania" : "Oczekiwanie...";

    return (
        <div className={cn(
            "bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500",
            className
        )}>
            {/* Header: Icon & Name */}
            <div className="flex items-start gap-5">
                <div className={cn(
                    "p-4 rounded-xl border transition-colors shadow-inner bg-zinc-950",
                    fileName ? "border-zinc-800" : "border-zinc-900 opacity-50"
                )}>
                    {getFileIcon(fileName)}
                </div>
                <div className="space-y-1 overflow-hidden">
                    <h3 className={cn(
                        "text-lg font-bold truncate font-mono tracking-tight leading-none pt-1",
                        fileName ? "text-white" : "text-zinc-600 italic"
                    )} title={fileName || "Nie wybrano pliku"}>
                        {fileName || "Brak zasobu"}
                    </h3>
                    <p className="text-sm text-zinc-500 font-mono tracking-tight mt-1 truncate" title={hubLabel}>
                        {hubLabel}
                    </p>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 gap-4 pt-2">
                {/* Size */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                    <span className="text-[14px] font-mono text-zinc-400">Rozmiar</span>
                    <span className={cn(
                        "text-[14px] font-mono",
                        fileSize ? "text-white" : "text-zinc-700"
                    )}>{fileSize || "0 KB"}</span>
                </div>

                {/* Tokens */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                    <span className="text-[14px] font-mono text-zinc-400">Liczba Tokenów</span>
                    <span className={cn(
                        "text-[14px] font-mono",
                        tokenCount > 0 ? "text-white" : "text-zinc-700"
                    )}>{tokenCount.toLocaleString()}</span>
                </div>

                {/* Cost */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                    <span className="text-[14px] font-mono text-zinc-400">Koszt Indeksowania</span>
                    <span className={cn(
                        "text-[14px] font-mono",
                        estimatedCost > 0 ? "text-amber-500" : "text-zinc-700"
                    )}>{formatCost(estimatedCost)}</span>
                </div>
            </div>

            {/* Footer Status */}
            <div className="pt-2 border-t border-zinc-800/50">
                <p className="text-[11px] text-zinc-600 font-mono leading-relaxed">
                    * Koszt liczony na podstawie wejścia (Input Embedding) wybranego modelu.
                </p>
            </div>
        </div>
    );
};
