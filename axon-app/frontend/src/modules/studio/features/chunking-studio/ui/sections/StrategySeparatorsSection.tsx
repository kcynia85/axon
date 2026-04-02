"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { Badge } from "@/shared/ui/ui/Badge";
import { useFormContext } from "react-hook-form";

export const StrategySeparatorsSection = () => {
    const { watch } = useFormContext();
    const method = watch("strategy_chunking_method");
    const separators = watch("strategy_chunk_boundaries.separators") || ["\\n\\n", "\\n", " "];

    if (method !== "Recursive_Character") return null;

    return (
        <FormSection 
            id="separators"
            number={3}
            title="Separatory" 
            description="Dla metody Recursive Character możesz zdefiniować hierarchię separatorów."
            variant="island"
        >
            <div className="space-y-4">
                <div className="grid gap-3">
                    {separators.map((s: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-primary border-none">
                                    {s}
                                </Badge>
                                <span className="text-sm font-bold text-zinc-400">
                                    {s === "\\n\\n" ? "Podwójny Enter" : s === "\\n" ? "Nowa linia" : s === " " ? "Spacja" : "Inny"}
                                </span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Poziom {i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>
        </FormSection>
    );
};
