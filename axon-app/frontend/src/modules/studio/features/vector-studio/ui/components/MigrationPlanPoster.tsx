"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { Info } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/ui/ui/Accordion";

export const MigrationPlanPoster = () => {
    const { control } = useFormContext();
    const dimensions = useWatch({
        control,
        name: "vector_database_expected_dimensions",
    }) || "XXXX";

    return (
        <div className="w-full h-full p-6 space-y-8 flex flex-col overflow-y-auto">
            <div className="space-y-4">
                <Card className="bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden rounded-2xl">
                    <CardHeader className="p-6 pb-4 border-b border-zinc-900/50">
                        <CardTitle className="text-2xl font-black tracking-tight text-white">
                            Plan migracji
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-1 text-sm text-white space-y-4">
                        <ol className="list-decimal list-inside space-y-3 font-medium">
                            <li>
                                Utworzenie nowej tabeli 
                                <code className="bg-primary/10 text-zinc-400 px-1.5 py-0.5 rounded font-mono text-[12px] ml-1 border border-primary/20">
                                    vectors_{dimensions}_v2
                                </code>
                            </li>
                            <li>
                                Pobranie treści (raw content) wszystkich plików z 
                                <span className="text-white ml-1 font-bold  text-zinc-400 underline decoration-primary/30">Resources</span>.
                            </li>
                            <li>Ponowne przeliczenie wektorów przy użyciu nowego modelu.</li>
                        </ol>

                        <div className="mt-8 p-5 bg-black/40 rounded-xl border border-zinc-800/50 flex justify-between items-center">
                            <span className="text-[12px] font-black text-zinc-500">Koszt estymowany</span>
                            <span className="text-xl font-mono font-black text-primary">$0.12</span>
                        </div>

                        <Accordion type="single" collapsible className="w-full mt-4">
                            <AccordionItem value="warning" className="border-none">
                                <AccordionTrigger className="py-3 px-4 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 hover:no-underline font-bold text-[14px] transition-all border border-amber-500/10">
                                    <div className="flex items-center gap-2">
                                        <Info className="w-8 h-8" />
                                        Uwaga przeczytaj przed indeksacją
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 px-4 text-xs text-zinc-500 leading-relaxed text-[14px] bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 ">
                                    Zmiana modelu embeddingu to operacja destruktywna. Wszystkie istniejące wektory w bazie staną się <span className="font-black">niekompatybilne</span> z nowym modelem i muszą zostać wygenerowane od nowa.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
