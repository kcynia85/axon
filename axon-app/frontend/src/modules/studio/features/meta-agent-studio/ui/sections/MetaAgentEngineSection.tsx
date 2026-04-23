"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormSlider } from "@/shared/ui/form/FormSlider";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { MetaAgentStudioData } from "../../types/meta-agent-schema";
import { LLMModel } from "@/shared/domain/settings";

interface Props {
    readonly llmModels?: LLMModel[];
}

export const MetaAgentEngineSection = ({ llmModels }: Props) => {
    const { control, formState: { errors } } = useFormContext<MetaAgentStudioData>();

    // Filter models to only show reasoning models
    const reasoningModels = llmModels?.filter(m => m.model_supports_thinking === true) ?? [];
    const modelOptions = reasoningModels.map(model => ({
        id: model.id,
        name: `${model.model_display_name} (${model.model_id})`
    }));

    return (
        <FormSection 
            id="reasoning" 
            number={2} 
            title="Cognitive Engine"
            description="Select the primary reasoning model and adjust creativity levels."
            variant="island"
        >
            <div className="space-y-12 max-w-4xl">
                <FormItemField 
                    label="Primary Reasoning Model" 
                    error={errors.llm_model_id?.message}
                    hint="Only models explicitly supporting 'Reasoning' or 'Thinking' capabilities are available here."
                >
                    <Controller
                        control={control}
                        name="llm_model_id"
                        render={({ field }) => (
                            <FormSelect
                                options={modelOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select a reasoning model..."
                                renderTrigger={(selectedItems) => (
                                    <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                        <span className={cn(
                                            "text-lg font-bold transition-colors flex-1 text-left",
                                            selectedItems.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                        )}>
                                            {selectedItems.length > 0 ? selectedItems[0].name : "Select a reasoning model..."}
                                        </span>
                                        <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                    </div>
                                )}
                            />
                        )}
                    />
                </FormItemField>

                <FormItemField 
                    label="Creativity (Temperature)"
                    hint="Logical & Focused (0.0) vs. Creative & Varied (1.0)"
                >
                    <Controller
                        control={control}
                        name="meta_agent_temperature"
                        render={({ field }) => (
                            <FormSlider
                                value={field.value}
                                onChange={field.onChange}
                                min={0}
                                max={1}
                                step={0.01}
                                labelLeft="Focused"
                                labelRight="Creative"
                                className="pt-4"
                            />
                        )}
                    />
                </FormItemField>
            </div>
        </FormSection>
    );
};
