"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { AlertCircle, Info, Database } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

export const MigrationPlanPoster = () => {
    const { control } = useFormContext();
    const dimensions = useWatch({
        control,
        name: "model_vector_dimensions",
    }) || "XXXX";

    return (
        <div className="w-full h-full p-6 space-y-8 flex flex-col overflow-y-auto">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Plan Migracji</h2>
                        <p className="text-xs text-zinc-500 font-medium italic">Destructive Operation Protocol</p>
                    </div>
                </div>

                <Card className="border-amber-500/20 bg-amber-500/5 shadow-xl">
                    <CardHeader className="p-4 pb-2 border-b border-amber-500/10">
                        <CardTitle className="text-sm font-bold text-amber-600 flex items-center gap-2">
                            <Database className="w-4 h-4" /> Kroki Techniczne
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-4 text-sm text-zinc-400 space-y-4">
                        <ol className="list-decimal list-inside space-y-3 font-medium">
                            <li>
                                Utworzenie nowej tabeli 
                                <code className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-mono text-[11px] ml-1">
                                    vectors_{dimensions}_v2
                                </code>
                            </li>
                            <li>
                                Pobranie treści (raw content) wszystkich plików z 
                                <span className="text-white ml-1 font-bold">Resources</span>.
                            </li>
                            <li>Ponowne przeliczenie wektorów przy użyciu nowego modelu.</li>
                        </ol>

                        <div className="mt-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Koszt estymowany</span>
                            <span className="text-lg font-mono font-bold text-primary">$0.12</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm">
                    <Info className="w-4 h-4 text-primary" />
                    Uwaga
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                    Zmiana modelu embeddingu to operacja destruktywna. Wszystkie istniejące wektory w bazie staną się <strong className="text-zinc-300">niekompatybilne</strong> z nowym modelem i muszą zostać wygenerowane od nowa.
                </p>
            </div>
        </div>
    );
};
