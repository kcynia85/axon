"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { Info } from "lucide-react";

export const StrategyParamsSection = () => {
    return (
        <FormSection 
            id="params"
            number={2}
            title="Parametry rozmiaru" 
            description="Określ jak duże powinny być kawałki tekstu i jaka powinna być nakładka między nimi."
            variant="island"
        >
            <div className="grid grid-cols-2 gap-6">
                <FormTextField
                    name="strategy_chunk_size"
                    label="Chunk Size"
                    type="number"
                    placeholder="1000"
                />
                <FormTextField
                    name="strategy_chunk_overlap"
                    label="Chunk Overlap"
                    type="number"
                    placeholder="200"
                />
            </div>
            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                    Zalecane ustawienia dla ogólnego tekstu to rozmiar <strong className="text-white">1000</strong> znaków z nakładką <strong className="text-white">200</strong>. Zapobiega to utracie kontekstu na granicach podziału.
                </p>
            </div>
        </FormSection>
    );
};
