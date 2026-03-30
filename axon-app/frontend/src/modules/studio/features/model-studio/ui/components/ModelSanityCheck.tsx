import React, { useState, useMemo } from "react";
import { useTestLLMModel } from "@/modules/settings/application/useSettings";
import { Button } from "@/shared/ui/ui/Button";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { MetricBlock } from "@/shared/ui/complex/MetricBlock";
import { cn } from "@/shared/lib/utils";
import { CheckCircle2, AlertCircle, Play, ChevronDown, ListIcon, Code2, Globe, Cpu } from "lucide-react";
import { countTokens } from "@/shared/lib/tokenization";

interface ModelSanityCheckProps {
    modelId: string;
    className?: string;
}

interface SanityCheckResult {
    success: boolean;
    response_text: string;
    latency_ms: number;
    cost_usd: number;
    tokens_used: number;
    model_used: string;
}

export const ModelSanityCheck = ({ modelId, className }: ModelSanityCheckProps) => {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState<SanityCheckResult | null>(null);
    const [showMetrics, setShowMetrics] = useState(false);
    const { mutateAsync: testModel, isPending } = useTestLLMModel();

    const promptTokens = useMemo(() => countTokens(prompt, "cl100k_base"), [prompt]);

    const handleRunTest = async () => {
        if (!prompt.trim() || !modelId) return;
        
        try {
            const response = await testModel({ id: modelId, prompt });
            setResult(response as SanityCheckResult);
        } catch (error) {
            console.error("Sanity check failed:", error);
            setResult({
                success: false,
                response_text: "Error: Failed to connect to the model.",
                latency_ms: 0,
                cost_usd: 0,
                tokens_used: 0,
                model_used: "unknown"
            });
        }
    };

    return (
        <Card className={cn("w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 shadow-none", className)}>
            <CardHeader className="pb-8 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white leading-none mb-1">
                                Test Połączenia
                            </CardTitle>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">
                                Model Inference Test
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-8">
                {/* Prompt Testowy */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Testowy Prompt
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-400">
                            {promptTokens} tokenów
                        </span>
                    </div>
                    <div className="space-y-4">
                        <Textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Wpisz zapytanie do modelu..."
                            className="min-h-[100px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-1 ring-primary transition-all text-sm rounded-xl"
                        />
                        <Button 
                            onClick={handleRunTest}
                            disabled={isPending || !prompt.trim() || !modelId}
                            variant="secondary"
                            className="w-full h-11"
                        >
                            {isPending ? "Testowanie..." : <><Play className="w-4 h-4" /> Wyślij Test</>}
                        </Button>
                    </div>
                </div>

                {/* Wynik (Live) */}
                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                            Odpowiedź Modelu
                        </h4>
                        <div className={cn(
                            "p-5 border rounded-2xl text-sm leading-relaxed",
                            result.success 
                                ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 italic" 
                                : "bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400"
                        )}>
                            {result.response_text}
                        </div>
                    </div>
                )}

                {/* Metryki Toggle */}
                {result && result.success && (
                    <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                        <button 
                            onClick={() => setShowMetrics(!showMetrics)}
                            className="flex items-center justify-between w-full text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] group/btn"
                        >
                            <div className="flex items-center gap-2 text-zinc-500">
                                Pokaż Szczegóły Wykonania
                            </div>
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-zinc-400 group-hover/btn:text-zinc-900 dark:group-hover/btn:text-white", showMetrics && "rotate-180")} />
                        </button>
                        
                        {showMetrics && (
                            <div className="grid grid-cols-3 gap-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <MetricBlock 
                                    label="Opóźnienie"
                                    value={`${(result.latency_ms / 1000).toFixed(2)}s`}
                                />
                                <MetricBlock 
                                    label="Koszt"
                                    value={`$${result.cost_usd.toFixed(5)}`}
                                />
                                <MetricBlock 
                                    label="Tokeny"
                                    value={`${result.tokens_used}`}
                                />
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
