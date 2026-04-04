"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { useFormContext, Controller } from "react-hook-form";
import { Scissors, ChevronDown, ListFilter, Type, FileCode, Hash, FileJson, Sparkles, FileText } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
    onSyncDraft: () => void;
}

const CHUNKING_METHOD_OPTIONS = [
    { id: "Recursive_Character", name: "Recursive Character", description: "Zalecany / Inteligentny", icon: Scissors },
    { id: "Character", name: "Character Splitter", description: "Stały znak separatora", icon: Type },
    { id: "Markdown", name: "Markdown Splitter", description: "Nagłówki i listy MD", icon: ListFilter },
    { id: "HTML", name: "HTML Splitter", description: "Struktura tagów DOM", icon: FileCode },
    { id: "Code_Splitter", name: "Code Splitter", description: "Klasy i funkcje (JS/PY)", icon: FileCode },
    { id: "Token_Splitter", name: "Token Splitter", description: "Zgodność z tiktoken", icon: Hash },
    { id: "LaTeX", name: "LaTeX Splitter", description: "Dokumentacja techniczna", icon: FileText },
    { id: "JSON", name: "JSON Splitter", description: "Obiekty i tablice", icon: FileJson },
    { id: "Semantic", name: "Semantic Chunker", description: "Model-based (AI)", icon: Sparkles },
];

export const StrategyBasicSection = ({ onSyncDraft }: Props) => {
    const { control, register, setValue, formState: { errors } } = useFormContext();

    const handleMethodChange = (val: string, onChange: (val: string) => void) => {
        onChange(val);
        
        // Reset or set default boundaries based on method
        if (val === "Recursive_Character") {
            setValue("strategy_chunk_boundaries", { separators: ["\\n\\n", "\\n", " "] });
        } else if (val === "Character") {
            setValue("strategy_chunk_boundaries", { separators: [" "] });
        } else {
            setValue("strategy_chunk_boundaries", { separators: [] });
        }
        
        onSyncDraft();
    };

    return (
        <FormSection 
            id="basic"
            number={1}
            title="Podstawowe informacje" 
            description="Nazwij swoją strategię i wybierz algorytm podziału tekstu z biblioteki LangChain."
            variant="island"
        >
            <div className="space-y-6">
                <FormItemField 
                    label="Nazwa Strategii"
                    error={errors.strategy_name?.message as string}
                >
                    <FormTextField
                        {...register("strategy_name")}
                        onBlur={onSyncDraft}
                        placeholder="np. General Text"
                    />
                </FormItemField>

                <FormItemField
                    label="Metoda Podziału (LangChain Splitter)"
                    error={errors.strategy_chunking_method?.message as string}
                >
                    <Controller
                        name="strategy_chunking_method"
                        control={control}
                        render={({ field }) => (
                            <FormSelect
                                options={CHUNKING_METHOD_OPTIONS}
                                value={field.value}
                                onChange={(val) => handleMethodChange(val, field.onChange)}
                                placeholder="Wybierz metodę..."
                                renderTrigger={(selected) => {
                                    const option = CHUNKING_METHOD_OPTIONS.find(o => o.id === field.value);
                                    const Icon = option?.icon || Scissors;
                                    
                                    return (
                                        <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                            <Icon className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                            <div className="flex flex-col flex-1 text-left min-w-0">
                                                <span className={cn(
                                                    "text-lg font-bold transition-colors truncate",
                                                    selected.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                                )}>
                                                    {selected.length > 0 ? selected[0].name : "Wybierz metodę..."}
                                                </span>
                                                {option?.description && (
                                                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest truncate">
                                                        {option.description}
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                        </div>
                                    );
                                }}
                            />
                        )}
                    />
                </FormItemField>
            </div>
        </FormSection>
    );
};
