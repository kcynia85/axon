"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/shared/ui/ui/Select";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
    onSyncDraft: () => void;
}

export const StrategyBasicSection = ({ onSyncDraft }: Props) => {
    const { control, register } = useFormContext();

    return (
        <FormSection 
            id="basic"
            number={1}
            title="Podstawowe informacje" 
            description="Nazwij swoją strategię i wybierz algorytm podziału tekstu z biblioteki LangChain."
            variant="island"
        >
            <div className="space-y-6">
                <FormItemField label="Nazwa Strategii">
                    <FormTextField
                        {...register("strategy_name")}
                        onBlur={onSyncDraft}
                        placeholder="np. General Text"
                    />
                </FormItemField>

                <FormItemField
                    label="Metoda Podziału (LangChain Splitter)"
                >
                    <Controller
                        name="strategy_chunking_method"
                        control={control}
                        render={({ field }) => (
                            <Select 
                                onValueChange={(val) => {
                                    field.onChange(val);
                                    onSyncDraft();
                                }} 
                                value={field.value}
                            >
                                <SelectTrigger className="h-12 bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="Wybierz metodę" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Recursive_Character">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span>Recursive Character</span>
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Zalecany / Inteligentny</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Character">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span>Character Splitter</span>
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Stały znak separatora</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Markdown">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span>Markdown Splitter</span>
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Nagłówki i listy MD</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="HTML">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span>HTML Splitter</span>
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Struktura tagów DOM</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Code_Splitter">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span>Code Splitter</span>
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Klasy i funkcje (JS/PY)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Token_Splitter">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span>Token Splitter</span>
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Zgodność z tiktoken</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="LaTeX">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span>LaTeX Splitter</span>
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Dokumentacja techniczna</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="JSON">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span>JSON Splitter</span>
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Obiekty i tablice</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Semantic">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span>Semantic Chunker</span>
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Model-based (AI)</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormItemField>
            </div>
        </FormSection>
    );
};
