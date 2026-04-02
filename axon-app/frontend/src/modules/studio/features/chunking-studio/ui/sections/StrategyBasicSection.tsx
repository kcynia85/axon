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

export const StrategyBasicSection = () => {
    const { control } = useFormContext();

    return (
        <FormSection 
            id="basic"
            number={1}
            title="Podstawowe informacje" 
            description="Nazwij swoją strategię i wybierz algorytm podziału tekstu."
            variant="island"
        >
            <div className="space-y-6">
                <FormTextField
                    name="strategy_name"
                    label="Nazwa Strategii"
                    placeholder="np. General Text"
                />

                <FormItemField
                    name="strategy_chunking_method"
                    label="Metoda Podziału (Splitter)"
                >
                    <Controller
                        name="strategy_chunking_method"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="h-12 bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="Wybierz metodę" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Recursive_Character">Recursive Character (Semantyczny)</SelectItem>
                                    <SelectItem value="Code_Splitter">Code Splitter (Strukturalny)</SelectItem>
                                    <SelectItem value="Token_Splitter">Token Splitter (Dokładny)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormItemField>
            </div>
        </FormSection>
    );
};
