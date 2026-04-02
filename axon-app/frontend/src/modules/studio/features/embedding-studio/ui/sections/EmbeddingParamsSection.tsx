"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";

export const EmbeddingParamsSection = () => {
    return (
        <FormSection 
            id="technical"
            number={2}
            title="Parametry Techniczne" 
            description="Określ wymiary wektorów oraz limity modelu."
            variant="island"
        >
            <div className="grid grid-cols-2 gap-6">
                <FormTextField
                    name="model_vector_dimensions"
                    label="Wymiary (Dimensions)"
                    type="number"
                    placeholder="1536"
                />
                <FormTextField
                    name="model_max_context_tokens"
                    label="Max Context (Tokens)"
                    type="number"
                    placeholder="8191"
                />
            </div>
        </FormSection>
    );
};
