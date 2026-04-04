"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/ui/Tooltip";

interface Props {
    onSyncDraft: () => void;
}

export const StrategyParamsSection = ({ onSyncDraft }: Props) => {
    const { control, formState: { errors } } = useFormContext();
    const rawMethod = useWatch({ control, name: "strategy_chunking_method" });
    const method = rawMethod?.toLowerCase().replace(/_/g, "");

    const isTokenBased = method === "tokensplitter";
    const isSemantic = method === "semantic";
    
    // Config based on method
    const config = {
        sizeLabel: isTokenBased ? "Rozmiar fragmentu (Tokens)" : "Rozmiar fragmentu (Characters)",
        sizeHint: isTokenBased 
            ? "Liczba tokenów (tiktoken) na pojedynczy fragment. Zalecane: 512 - 1024."
            : isSemantic
                ? "Maksymalny rozmiar fragmentu w znakach. Semantic Chunker dąży do podziału tematycznego, ale nie przekroczy tego limitu."
                : "Zalecany rozmiar dla ogólnego tekstu to 1000 znaków. Określa maksymalną długość pojedynczego fragmentu.",
        overlapLabel: isTokenBased ? "Nakładka (Tokens)" : "Nakładka (Characters)",
        overlapHint: isTokenBased
            ? "Liczba wspólnych tokenów między fragmentami. Zapobiega ucinaniu myśli w połowie zdania."
            : "Zalecana nakładka to ok. 10-20% rozmiaru fragmentu (np. 200 znaków).",
        showOverlap: !isSemantic // Semantic chunking usually doesn't use fixed overlap in the same way
    };

    const LabelWithInfo = ({ label, info }: { label: string, info: string }) => (
        <div className="flex items-center gap-2">
            <span>{label}</span>
            {isSemantic && (
                <TooltipProvider>
                    <Tooltip
                        content={
                            <p>
                                <strong className="text-zinc-200">Semantic Chunker</strong> wykorzystuje embeddingi do wykrywania przerw tematycznych. Rozmiar fragmentu jest traktowany jako limit górny (guardrail), a nie sztywny podział.
                            </p>
                        }
                        className="max-w-[300px] p-3 text-xs leading-relaxed bg-zinc-950 border-zinc-800 text-zinc-400"
                    >
                        <div className="cursor-help text-zinc-500 hover:text-zinc-300 transition-colors">
                            <Info size={14} />
                        </div>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );

    return (
        <FormSection
            id="params"
            number={2}
            title="Parametry rozmiaru"
            description={isTokenBased ? "Skonfiguruj limity oparte na tokenach dla modeli LLM." : "Określ jak duże powinny być kawałki tekstu i jaka powinna być nakładka między nimi."}
            variant="island"
        >
            <div className="space-y-8 max-w-4xl">
                <FormItemField 
                    label={<LabelWithInfo label={config.sizeLabel} info={config.sizeHint} />}
                    error={errors.strategy_chunk_size?.message as string}
                    hint={config.sizeHint}
                >
                    <Controller
                        control={control}
                        name="strategy_chunk_size"
                        render={({ field }) => (
                            <FormTextField
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    onSyncDraft();
                                }}
                                onBlur={() => {
                                    field.onBlur();
                                    onSyncDraft();
                                }}
                                type="number"
                                placeholder={isTokenBased ? "512" : "1000"}
                            />
                        )}
                    />
                    </FormItemField>

                    {config.showOverlap && (
                    <FormItemField 
                    label={config.overlapLabel} 
                    error={errors.strategy_chunk_overlap?.message as string}
                    hint={config.overlapHint}
                    >
                    <Controller
                        control={control}
                        name="strategy_chunk_overlap"
                        render={({ field }) => (
                            <FormTextField
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    onSyncDraft();
                                }}
                                onBlur={() => {
                                    field.onBlur();
                                    onSyncDraft();
                                }}
                                type="number"
                                placeholder={isTokenBased ? "50" : "200"}
                            />
                        )}
                    />
                    </FormItemField>                )}
            </div>
        </FormSection>
    );
};
