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

export const EmbeddingIdentitySection = () => {
    const { control } = useFormContext();

    return (
        <FormSection 
            id="identity"
            number={1}
            title="Wybór Dostawcy" 
            description="Skonfiguruj providera dla Twojego modelu embeddingu."
            variant="island"
        >
            <div className="space-y-6">
                <FormItemField
                    name="model_provider_name"
                    label="Dostawca"
                >
                    <Controller
                        name="model_provider_name"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="h-12 bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="Wybierz dostawcę" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                                    <SelectItem value="Google">Google</SelectItem>
                                    <SelectItem value="Anthropic">Anthropic</SelectItem>
                                    <SelectItem value="Cohere">Cohere</SelectItem>
                                    <SelectItem value="Azure">Azure</SelectItem>
                                    <SelectItem value="Ollama">Ollama (Local)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormItemField>

                <FormTextField
                    name="model_id"
                    label="Model ID"
                    placeholder="np. text-embedding-3-small"
                />
            </div>
        </FormSection>
    );
};
