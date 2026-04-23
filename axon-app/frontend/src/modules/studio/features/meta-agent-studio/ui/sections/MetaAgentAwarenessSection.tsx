"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import type { MetaAgentStudioData } from "../../types/meta-agent-schema";

export const MetaAgentAwarenessSection = () => {
    const { control } = useFormContext<MetaAgentStudioData>();

    return (
        <FormSection 
            id="awareness" 
            number={3} 
            title="System Awareness"
            description="Configure how the Meta-Agent interacts with indexed system data."
            variant="island"
        >
            <div className="space-y-12 max-w-4xl">
                <Controller
                    control={control}
                    name="meta_agent_rag_enabled"
                    render={({ field }) => (
                        <FormCheckbox
                            title="RAG#2 Engine Access"
                            description="When enabled, the Meta-Agent can search and understand the live status of agents, crews, and tools within Axon."
                            checked={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>
        </FormSection>
    );
};
