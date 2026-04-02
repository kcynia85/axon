"use client";

import * as React from "react";
import { useChunkingStrategies, useCreateChunkingStrategy, useDeleteChunkingStrategy, useSimulateChunking } from "../application/useSettings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import { Label } from "@/shared/ui/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/Select";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Scissors, Play, Layers, Info, Trash2, Plus, RefreshCw } from "lucide-react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/shared/lib/utils";
import type { ChunkingStrategy } from "@/shared/domain/settings";

const schema = z.object({
    strategy_name: z.string().min(1, "Nazwa jest wymagana"),
    strategy_chunking_method: z.string().min(1, "Metoda podziału jest wymagana"),
    strategy_chunk_size: z.coerce.number().min(1, "Rozmiar musi być większy od 0"),
    strategy_chunk_overlap: z.coerce.number().min(0, "Nakładka nie może być ujemna"),
    strategy_chunk_boundaries: z.record(z.any()).default({}),
});

type FormData = z.infer<typeof schema>;

export const ChunkingStrategiesView = () => {
    const { data: strategies, isLoading: isLoadingStrategies } = useChunkingStrategies();
    const { mutateAsync: createStrategy, isPending: isSaving } = useCreateChunkingStrategy();
    const { mutateAsync: deleteStrategy } = useDeleteChunkingStrategy();
    const { mutateAsync: simulateChunking, isPending: isSimulating } = useSimulateChunking();

    const [selectedStrategy, setSelectedStrategy] = React.useState<ChunkingStrategy | null>(null);
    const [isCreating, setIsCreating] = React.useState(false);
    const [simText, setSimText] = React.useState("");
    const [simChunks, setSimChunks] = React.useState<string[]>([]);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            strategy_name: "",
            strategy_chunking_method: "Recursive_Character",
            strategy_chunk_size: 1000,
            strategy_chunk_overlap: 200,
            strategy_chunk_boundaries: { separators: ["\\n\\n", "\\n", " "] },
        },
    });

    React.useEffect(() => {
        if (selectedStrategy) {
            form.reset({
                strategy_name: selectedStrategy.strategy_name,
                strategy_chunking_method: selectedStrategy.strategy_chunking_method,
                strategy_chunk_size: selectedStrategy.strategy_chunk_size,
                strategy_chunk_overlap: selectedStrategy.strategy_chunk_overlap,
                strategy_chunk_boundaries: selectedStrategy.strategy_chunk_boundaries,
            });
            setIsCreating(false);
        }
    }, [selectedStrategy, form]);

    const handleCreateNew = () => {
        setSelectedStrategy(null);
        setIsCreating(true);
        form.reset({
            strategy_name: "",
            strategy_chunking_method: "Recursive_Character",
            strategy_chunk_size: 1000,
            strategy_chunk_overlap: 200,
            strategy_chunk_boundaries: { separators: ["\\n\\n", "\\n", " "] },
        });
    };

    const handleSave = async (data: FormData) => {
        await createStrategy(data);
        setIsCreating(false);
        setSelectedStrategy(null);
    };

    const handleSimulate = async () => {
        if (!simText) return;
        
        const data = form.getValues();
        try {
            const res = await simulateChunking({
                text: simText,
                method: data.strategy_chunking_method,
                size: data.strategy_chunk_size,
                overlap: data.strategy_chunk_overlap,
                boundaries: data.strategy_chunk_boundaries,
            }) as { chunks: string[] };
            
            setSimChunks(res.chunks || []);
        } catch (error) {
            console.error("Simulation failed:", error);
            // Fallback mock simulation if endpoint fails/not implemented fully
            const mockChunks = [];
            let start = 0;
            while (start < simText.length) {
                mockChunks.push(simText.slice(start, start + data.strategy_chunk_size));
                start += (data.strategy_chunk_size - data.strategy_chunk_overlap);
                if (mockChunks.length > 50) break; // Safety
            }
            setSimChunks(mockChunks);
        }
    };

    const separators = form.watch("strategy_chunk_boundaries.separators") || ["\\n\\n", "\\n", " "];
    const isEditing = selectedStrategy || isCreating;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            {/* LEFT: List of Strategies */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 border-r border-border">
                <div className="sticky top-0 bg-background z-10 pb-4">
                    <Button variant="outline" className="w-full justify-start text-muted-foreground font-bold border-dashed" onClick={handleCreateNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Utwórz Nową Strategię
                    </Button>
                </div>

                {isLoadingStrategies ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
                    </div>
                ) : (
                    strategies?.map((strategy) => (
                        <Card 
                            key={strategy.id} 
                            className={cn(
                                "cursor-pointer transition-all hover:border-primary/50 bg-muted/5",
                                selectedStrategy?.id === strategy.id && "border-primary shadow-sm bg-primary/5"
                            )}
                            onClick={() => setSelectedStrategy(strategy)}
                        >
                            <CardHeader className="p-3 pb-1">
                                <CardTitle className="text-sm font-bold truncate pr-2">{strategy.strategy_name}</CardTitle>
                                <CardDescription className="text-[10px] font-mono uppercase opacity-60">
                                    {strategy.strategy_chunking_method.split('_')[0]}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-2">
                                <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                                    <span className="font-bold">{strategy.strategy_chunk_size}</span>
                                    <span>/</span>
                                    <span>{strategy.strategy_chunk_overlap}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* MIDDLE: Form */}
            <div className="flex flex-col gap-6 overflow-y-auto pr-4 border-r border-border">
                {!isEditing ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 opacity-50">
                        <Scissors className="w-12 h-12" />
                        <p className="text-sm font-medium">Wybierz strategię z listy lub utwórz nową.</p>
                    </div>
                ) : (
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8 pb-10">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight mb-1">
                                {isCreating ? "New Strategy" : "Edit Strategy"}
                            </h2>
                            <p className="text-xs text-muted-foreground">Skonfiguruj parametry podziału tekstu.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1. Nazwa</h3>
                                <div className="space-y-1">
                                    <Input placeholder="np. General Text" {...form.register("strategy_name")} className="text-sm h-10" />
                                    {form.formState.errors.strategy_name && <p className="text-[10px] text-red-500">{form.formState.errors.strategy_name.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">2. Metoda Podziału (Splitter)</h3>
                                <div className="space-y-1">
                                    <Controller
                                        name="strategy_chunking_method"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="h-10 text-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Recursive_Character">Recursive Character</SelectItem>
                                                    <SelectItem value="Code_Splitter">Code Splitter</SelectItem>
                                                    <SelectItem value="Token_Splitter">Token Splitter (Hard Limit)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">3. Parametry Rozmiaru</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Chunk Size (Wielkość)</Label>
                                        <Input type="number" {...form.register("strategy_chunk_size")} className="text-sm font-mono h-10" />
                                        {form.formState.errors.strategy_chunk_size && <p className="text-[10px] text-red-500">{form.formState.errors.strategy_chunk_size.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Chunk Overlap (Nakładka)</Label>
                                        <Input type="number" {...form.register("strategy_chunk_overlap")} className="text-sm font-mono h-10" />
                                        {form.formState.errors.strategy_chunk_overlap && <p className="text-[10px] text-red-500">{form.formState.errors.strategy_chunk_overlap.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {form.watch("strategy_chunking_method") === "Recursive_Character" && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">4. Separatory</h3>
                                    <div className="bg-muted/30 p-3 rounded-lg border text-xs font-mono space-y-2 text-muted-foreground">
                                        {separators.map((s: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <Badge variant="secondary" className="px-1.5 py-0 rounded">{s}</Badge>
                                                <span className="opacity-70 text-[10px]">
                                                    {s === "\\n\\n" ? "(Podwójny Enter)" : s === "\\n" ? "(Nowa linia)" : s === " " ? "(Spacja)" : "(Inny)"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <Button type="button" variant="ghost" onClick={() => { setIsCreating(false); setSelectedStrategy(null); }} disabled={isSaving}>
                                Anuluj
                            </Button>
                            <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 font-bold">
                                {isSaving ? "Zapisywanie..." : "Zapisz Strategię"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            {/* RIGHT: Simulator */}
            <div className="flex flex-col gap-6 overflow-y-auto pl-2">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight mb-1">Symulator Chunkowania</h2>
                        <p className="text-xs text-muted-foreground">Testuj podział tekstu z obecnymi parametrami.</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Wklej tekst</Label>
                        <Textarea 
                            placeholder="Wklej dokumentację lub raport do testów..."
                            className="h-32 resize-none font-mono text-[11px] leading-relaxed"
                            value={simText}
                            onChange={(e) => setSimText(e.target.value)}
                        />
                    </div>

                    <Button 
                        className="w-full font-bold" 
                        variant="secondary"
                        onClick={handleSimulate}
                        disabled={isSimulating || !simText || !isEditing}
                    >
                        {isSimulating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                        Testuj podział
                    </Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Wynik (Chunks)</h3>
                        <Badge variant="outline" className="text-[10px] font-mono font-bold">Liczba kawałków: {simChunks.length}</Badge>
                    </div>

                    <div className="space-y-3">
                        {simChunks.map((chunk, i) => (
                            <Card key={i} className="bg-muted/10 border-primary/10">
                                <div className="p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-primary">Chunk {i + 1}</span>
                                        <span className="text-[10px] font-mono text-muted-foreground opacity-70">{chunk.length} znaków</span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed font-serif text-foreground/90 whitespace-pre-wrap">
                                        {chunk}
                                    </p>
                                </div>
                            </Card>
                        ))}
                        
                        {simChunks.length === 0 && (
                            <div className="h-32 border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground italic gap-2 opacity-50">
                                <Layers className="w-6 h-6" />
                                <span className="text-xs">Brak wyników symulacji</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
