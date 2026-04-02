"use client";

import React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";

export const EmbeddingCostSection = () => {
    return (
        <FormSection 
            id="economy"
            number={3}
            title="Ekonomia" 
            description="Ustaw koszt tokenów dla celów analitycznych i monitorowania budżetu."
            variant="island"
        >
            <FormTextField
                name="model_cost_per_1m_tokens"
                label="Koszt (Input) / 1M tokenów"
                type="number"
                step="0.0001"
                placeholder="0.02"
            />
        </FormSection>
    );
};
