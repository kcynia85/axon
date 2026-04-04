"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
    onSyncDraft: () => void;
}

export const EmbeddingParamsSection = ({ onSyncDraft }: Props) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <FormSection 
            id="technical"
            number={2}
            title="Parametry Techniczne" 
            description="Określ wymiary wektorów oraz limity modelu."
            variant="island"
        >
            <div className="space-y-8 max-w-4xl">
                <FormItemField 
                    label="Wymiary wektorów (Dimensions)" 
                    error={errors.model_vector_dimensions?.message as string}
                    hint="Liczba wymiarów generowanych przez model (np. 1536 dla OpenAI)."
                >
                    <Controller
                        control={control}
                        name="model_vector_dimensions"
                        render={({ field }) => (
                            <FormTextField
                                {...field}
                                onBlur={() => {
                                    field.onBlur();
                                    onSyncDraft();
                                }}
                                type="number"
                                placeholder="1536"
                            />
                        )}
                    />
                </FormItemField>

                <FormItemField 
                    label="Maksymalny kontekst (Max Tokens)" 
                    error={errors.model_max_context_tokens?.message as string}
                    hint="Limit tokenów wejściowych dla pojedynczego zapytania embeddingu."
                >
                    <Controller
                        control={control}
                        name="model_max_context_tokens"
                        render={({ field }) => (
                            <FormTextField
                                {...field}
                                onBlur={() => {
                                    field.onBlur();
                                    onSyncDraft();
                                }}
                                type="number"
                                placeholder="8191"
                            />
                        )}
                    />
                </FormItemField>
            </div>
        </FormSection>
    );
};
