"use client";

import React, { useState } from "react";
import { useTestLLMProvider } from "@/modules/settings/application/useSettings";
import { Button } from "@/shared/ui/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { MetricBlock } from "@/shared/ui/complex/MetricBlock";
import { cn } from "@/shared/lib/utils";
import { CheckCircle2, AlertCircle, Play, ChevronDown, ListIcon, Code2, Globe } from "lucide-react";

interface ProviderSanityCheckProps {
    providerId: string;
    isValid: boolean;
    isDirty: boolean;
    className?: string;
}

interface ConnectionTestResult {
    success: boolean;
    message: string;
    latency_ms: number;
    raw_json?: any;
    mapped_models?: any[];
}

export const ProviderSanityCheck = ({ providerId, isValid, isDirty, className }: ProviderSanityCheckProps) => {
    const [result, setResult] = useState<ConnectionTestResult | null>(null);
    const [showRawJson, setShowRawJson] = useState(false);
    const [showModels, setShowModels] = useState(false);
    const { mutateAsync: testProvider, isPending } = useTestLLMProvider();

    const handleRunTest = async () => {
        if (!providerId) return;
        
        try {
            const response = await testProvider(providerId);
            setResult(response as ConnectionTestResult);
        } catch (error) {
            console.error("Provider connection test failed:", error);
            setResult({
                success: false,
                message: "Błąd: Nie udało się połączyć z dostawcą.",
                latency_ms: 0,
            });
        }
    };

    return (
        <Card className={cn("w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 shadow-none", className)}>
            <CardHeader className="pb-8 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white leading-none mb-1">
                                Test Połączenia
                            </CardTitle>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">
                                Provider Discovery
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-4">
                {/* Run Test Button */}
                <div className="space-y-4">
                  
                    <Button
                        onClick={handleRunTest}
                        disabled={isPending || !providerId}
                        variant="secondary"
                        className="w-full h-11"
                    >
                        {isPending ? "Testowanie..." : <><Play className="w-4 h-4" /> Rozpocznij Test</>}
                    </Button>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Sprawdź czy Twoja konfiguracja (Endpoint, Klucz, Nagłówki) pozwala na poprawne pobranie listy modeli.
                    </p>
                       </div>

                {/* Status Message */}
                {result && (
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                           Status
                        </h4>
                        <div className={cn(
                            "p-5 border rounded-2xl text-sm leading-relaxed break-all flex items-center gap-3",
                            result.success 
                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                                : "bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400"
                        )}>
                            {result.success ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    <span>Połączono pomyślnie</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {result.message}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Details Toggle */}
                {result && result.success && (
                    <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                        <button 
                            onClick={() => setShowModels(!showModels)}
                            className="flex items-center justify-between w-full text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-sm group/btn"
                        >
                            <div className="flex items-center gap-2 text-zinc-500">
                                Pokaż Szczegóły
                            </div>
                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 text-zinc-400 group-hover/btn:text-zinc-900 dark:group-hover/btn:text-white", showModels && "rotate-180")} />
                        </button>

                        {showModels && (
                            <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <MetricBlock 
                                        label="Opóźnienie"
                                        value={`${(result.latency_ms / 1000).toFixed(2)}s`}
                                    />
                                    <MetricBlock 
                                        label="Modele"
                                        value={`${result.mapped_models?.length || 0}`}
                                    />
                                </div>

                                {/* Models List */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                                        <ListIcon className="w-3 h-3" />
                                        Wykryte Modele ({result.mapped_models?.length || 0})
                                    </div>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {result.mapped_models?.map((m: any) => (
                                            <div key={m.id} className="flex flex-col p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                                <span className="text-xs font-bold text-zinc-900 dark:text-white capitalize">{m.name}</span>
                                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter mt-1">{m.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Raw JSON */}
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => setShowRawJson(!showRawJson)}
                                        className="flex items-center justify-between w-full text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] group/btn"
                                    >
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Code2 className="w-3.5 h-3.5" />
                                            Surowy JSON (Discovery)
                                        </div>
                                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-zinc-400", showRawJson && "rotate-180")} />
                                    </button>
                                    
                                    {showRawJson && (
                                        <pre className="p-4 bg-zinc-950 text-emerald-500 text-[10px] font-mono rounded-xl overflow-x-auto max-h-[300px] custom-scrollbar border border-zinc-900 mt-2">
                                            {JSON.stringify(result.raw_json, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
