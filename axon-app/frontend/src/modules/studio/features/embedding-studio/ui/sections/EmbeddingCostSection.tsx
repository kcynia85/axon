"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
    onSyncDraft: () => void;
}

export const EmbeddingCostSection = ({ onSyncDraft }: Props) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <FormSection 
            id="economy"
            number={3}
            title="Ekonomia" 
            description="Ustaw koszt tokenów dla celów analitycznych i monitorowania budżetu."
            variant="island"
        >
            <div className="max-w-4xl">
                <FormItemField 
                    label="Koszt (Input) / 1M tokenów" 
                    error={errors.model_cost_per_1m_tokens?.message as string}
                    hint="Stawka za milion tokenów wejściowych w dolarach ($)."
                >
                    <Controller
                        control={control}
                        name="model_cost_per_1m_tokens"
                        render={({ field }) => (
                            <FormTextField
                                {...field}
                                onBlur={() => {
                                    field.onBlur();
                                    onSyncDraft();
                                }}
                                type="number"
                                step="0.0001"
                                placeholder="0.02"
                            />
                        )}
                    />
                </FormItemField>
            </div>
        </FormSection>
    );
};
