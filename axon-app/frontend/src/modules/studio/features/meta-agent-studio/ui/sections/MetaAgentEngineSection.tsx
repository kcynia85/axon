"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormSlider } from "@/shared/ui/form/FormSlider";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { ChevronDown, Cpu } from "lucide-react";
import { SiOpenai, SiAnthropic, SiGoogle } from "react-icons/si";
import { cn } from "@/shared/lib/utils";
import type { MetaAgentStudioData } from "../../types/meta-agent-schema";
import { LLMModel } from "@/shared/domain/settings";

interface Props {
    readonly llmModels?: LLMModel[];
}

export const MetaAgentEngineSection = ({ llmModels }: Props) => {
    const { control, formState: { errors } } = useFormContext<MetaAgentStudioData>();

    const getModelIcon = (modelId: string) => {
        const id = modelId.toLowerCase();
        if (id.includes("gpt") || id.includes("openai")) return <SiOpenai className="text-[#10a37f]" size={16} />;
        if (id.includes("claude") || id.includes("anthropic")) return <SiAnthropic className="text-[#d97757]" size={16} />;
        if (id.includes("gemini") || id.includes("google")) return <SiGoogle className="text-[#4285f4]" size={16} />;
        return <Cpu size={16} className="text-zinc-500" />;
    };

    // Allow all mapped models from all providers to be selectable
    const modelOptions = (llmModels ?? []).map(model => ({
        id: model.id,
        name: `${model.model_display_name} (${model.model_id})`,
        icon: getModelIcon(model.model_id)
    }));

    return (
        <FormSection 
            id="reasoning" 
            number={2} 
            title="Cognitive Engine"
            description="Select the primary model and adjust creativity levels."
            variant="island"
        >
            <div className="space-y-12 max-w-4xl">
                <FormItemField 
                    label="Primary Reasoning Model" 
                    error={errors.llm_model_id?.message}
                    hint="All available models from your configured providers are listed here."
                >
                    <Controller
                        control={control}
                        name="llm_model_id"
                        render={({ field }) => (
                            <FormSelect
                                options={modelOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select a model..."
                                renderTrigger={(selectedItems) => (
                                    <div className="flex items-center gap-4 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 h-16 rounded-2xl hover:border-zinc-700 transition-colors">
                                        <div className="p-2.5 rounded-xl bg-zinc-800 group-hover/trigger:bg-zinc-700 transition-colors shadow-inner border border-white/5 shrink-0">
                                            {selectedItems.length > 0 ? selectedItems[0].icon : <Cpu size={20} className="text-zinc-400" />}
                                        </div>
                                        <div className="flex flex-col flex-1 text-left overflow-hidden">
                                            <span className={cn(
                                                "text-[15px] font-black transition-colors tracking-tight truncate",
                                                selectedItems.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                            )}>
                                                {selectedItems.length > 0 ? selectedItems[0].name : "Select a model..."}
                                            </span>
                                            {selectedItems.length > 0 && (
                                                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none mt-0.5">
                                                    Primary Brain
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400 shrink-0" />
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
