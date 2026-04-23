"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { Info } from "lucide-react";
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

                <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                    <Info className="w-5 h-5 text-purple-400 mt-0.5" />
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Use clear, directive language to ensure consistent behavior across all interactions. 
                        Avoid ambiguous instructions that might lead to unexpected cognitive drifts.
                    </p>
                </div>
            </div>
        </FormSection>
    );
};
