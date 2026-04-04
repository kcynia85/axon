"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import { Hash, AlignLeft, Type } from "lucide-react";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";

interface Props {
    onSyncDraft: () => void;
}

export const StrategySeparatorsSection = ({ onSyncDraft }: Props) => {
    const { control, setValue, formState: { errors } } = useFormContext();
    
    // Watch the entire boundaries object for better reactivity
    const method = useWatch({ control, name: "strategy_chunking_method" });
    const boundaries = useWatch({ control, name: "strategy_chunk_boundaries" });
    
    const currentSeparators = React.useMemo(() => {
        return boundaries?.separators || ["\\n\\n", "\\n", " "];
    }, [boundaries]);

    // Case 1: Recursive Character (Level Selection)
    if (method === "Recursive_Character") {
        const currentLevel = currentSeparators.length;

        const handleLevelChange = (level: number) => {
            let nextSeparators = ["\\n\\n"];
            if (level >= 2) nextSeparators.push("\\n");
            if (level >= 3) nextSeparators.push(" ");
            
            setValue("strategy_chunk_boundaries", {
                ...boundaries,
                separators: nextSeparators
            }, {
                shouldDirty: true,
                shouldValidate: true
            });
            
            // Force immediate draft sync
            onSyncDraft();
        };

        return (
            <FormSection 
                id="separators"
                number={3}
                title="Separatory (Głębokość)" 
                description="Wybierz głębokość podziału tekstu dla algorytmu Recursive Character."
                variant="island"
            >
                <div className="grid grid-cols-1 gap-4 max-w-4xl">
                    <FormRadio
                        title="Podwójny Enter"
                        description="Podział tylko na akapity. Największe zachowanie kontekstu."
                        icon={Hash}
                        checked={currentLevel === 1}
                        onChange={() => handleLevelChange(1)}
                    />

                    <FormRadio
                        title="Nowa linia"
                        description="Podział na akapity oraz pojedyncze linie tekstu."
                        icon={AlignLeft}
                        checked={currentLevel === 2}
                        onChange={() => handleLevelChange(2)}
                    />

                    <FormRadio
                        title="Spacja"
                        description="Najbardziej granularny podział - aż do pojedynczych słów."
                        icon={Type}
                        checked={currentLevel === 3}
                        onChange={() => handleLevelChange(3)}
                    />
                </div>
            </FormSection>
        );
    }

    // Case 2: Simple Character (Single Separator)
    if (method === "Character") {
        return (
            <FormSection 
                id="separators"
                number={3}
                title="Separator" 
                description="Zdefiniuj znak, na którym ma nastąpić podział tekstu."
                variant="island"
            >
                <div className="max-w-4xl">
                    <FormItemField 
                        label="Znak separatora" 
                        error={(errors.strategy_chunk_boundaries as any)?.separators?.message}
                        hint="Wpisz znak podziału (domyślnie pusta spacja)."
                    >
                        <Controller
                            control={control}
                            name="strategy_chunk_boundaries.separators.0"
                            render={({ field }) => (
                                <FormTextField
                                    {...field}
                                    onBlur={() => {
                                        field.onBlur();
                                        onSyncDraft();
                                    }}
                                    placeholder="np. | lub ;"
                                />
                            )}
                        />
                    </FormItemField>
                </div>
            </FormSection>
        );
    }

    return null;
};
