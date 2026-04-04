"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Badge } from "@/shared/ui/ui/Badge";
import { Play, Layers, Scissors, RefreshCw } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useSimulateChunking } from "@/modules/settings/application/useSettings";

export const ChunkingSimulatorPoster = () => {
    const { control } = useFormContext();
    const { mutateAsync: simulateChunking, isPending } = useSimulateChunking();
    
    const [text, setText] = React.useState("");
    const [chunks, setChunks] = React.useState<string[]>([]);

    const strategyValues = useWatch({
        control,
    });

    const handleSimulate = async () => {
        if (!text) return;
        
        try {
            const res = await simulateChunking({
                text,
                method: strategyValues.strategy_chunking_method,
                size: strategyValues.strategy_chunk_size,
                overlap: strategyValues.strategy_chunk_overlap,
                boundaries: strategyValues.strategy_chunk_boundaries,
            }) as { chunks: string[] };
            
            setChunks(res.chunks || []);
        } catch (error) {
            console.error("Simulation failed:", error);
            // Fallback mock
            const mockChunks = [];
            let start = 0;
            const size = Number(strategyValues.strategy_chunk_size) || 1000;
            const overlap = Number(strategyValues.strategy_chunk_overlap) || 200;
            while (start < text.length) {
                mockChunks.push(text.slice(start, start + size));
                start += (size - overlap);
                if (mockChunks.length > 50) break;
            }
            setChunks(mockChunks);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 p-6 overflow-y-auto">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Symulator Chunkowania</h2>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-end items-center px-1">
                        <span className="text-[10px] font-mono text-zinc-600">{text.length} znaków</span>
                    </div>
                    <Textarea 
                        placeholder="Wklej dokumentację, raport lub treść strony..."
                        className="h-40 resize-none font-mono text-[11px] leading-relaxed bg-zinc-900 border-zinc-800"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <Button 
                    className="w-full font-bold shadow-lg shadow-primary/10" 
                    onClick={handleSimulate}
                    disabled={isPending || !text}
                >
                    {isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                    Testuj podział
                </Button>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800 flex-1">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Scissors className="w-3.5 h-3.5" /> Wynik (Chunks)
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono font-bold text-primary border-primary/20 bg-primary/5">
                        Kawałków: {chunks.length}
                    </Badge>
                </div>

                <div className="grid gap-4 pb-10">
                    {chunks.map((chunk, i) => (
                        <Card key={i} className="bg-zinc-900/50 border-zinc-800/50 hover:border-primary/20 transition-all">
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Chunk {i + 1}</span>
                                    <span className="text-[10px] font-mono text-zinc-500">{chunk.length} znaków</span>
                                </div>
                                <p className="text-[11px] leading-relaxed font-serif text-zinc-300 whitespace-pre-wrap">
                                    {chunk}
                                </p>
                            </div>
                        </Card>
                    ))}
                    
                    {chunks.length === 0 && (
                        <div className="h-40 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600 gap-2">
                            <Layers className="w-8 h-8 opacity-20" />
                            <span className="text-xs font-medium italic">Brak wyników symulacji</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
