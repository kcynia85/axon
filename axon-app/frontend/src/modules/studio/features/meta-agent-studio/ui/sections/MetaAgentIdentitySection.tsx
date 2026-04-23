"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import type { MetaAgentStudioData } from "../../types/meta-agent-schema";

export const MetaAgentIdentitySection = () => {
    const { control } = useFormContext<MetaAgentStudioData>();

    return (
        <FormSection 
            id="identity" 
            number={1} 
            title="Core Identity"
            description="Define how the Meta-Agent behaves, thinks, and presents itself."
            variant="island"
        >
            <div className="space-y-12 max-w-4xl">
                <FormItemField 
                    label="System Prompt"
                    hint="The system prompt defines the base persona and cognitive boundaries of the Meta-Agent."
                >
                    <Controller
                        control={control}
                        name="meta_agent_system_prompt"
                        render={({ field }) => (
                            <FormTextarea
                                {...field}
                                placeholder="You are Axon, a highly intelligent orchestrator..."
                                className="min-h-[400px] bg-zinc-950/50 border-white/5 text-zinc-100 placeholder:text-zinc-700 focus:border-purple-500/50 transition-all text-base leading-relaxed p-6 rounded-2xl resize-none"
                            />
                        )}
                    />
                </FormItemField>


            </div>
        </FormSection>
    );
};
