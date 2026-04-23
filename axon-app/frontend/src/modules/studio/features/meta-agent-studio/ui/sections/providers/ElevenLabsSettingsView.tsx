import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormSlider } from "@/shared/ui/form/FormSlider";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { Switch, Spinner } from "@heroui/react";
import { ChevronDown, Zap, Settings2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useVoiceModels } from "@/modules/system/application/meta-agent.hooks";
import { NativeAccordion } from "@/shared/ui/ui/NativeAccordion";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import type { MetaAgentStudioData } from "../../../types/meta-agent-schema";

export const ElevenLabsSettingsView = () => {
    const { control, formState: { errors } } = useFormContext<MetaAgentStudioData>();
    const { data: models, isLoading } = useVoiceModels("ElevenLabs");
    
    // Safety check for errors
    const configErrors = errors.provider_config as Record<string, any> | undefined;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-top-2 duration-300 relative z-10">
            <div className="flex flex-col gap-8">
                <FormItemField 
                    label="Voice ID" 
                    error={configErrors?.voice_id?.message}
                    hint="The ElevenLabs Voice ID (e.g. pMsXgVXv3BLzUgSgWJ5L)."
                >
                    <Controller
                        control={control}
                        name="provider_config.voice_id"
                        render={({ field }) => (
                            <FormTextField
                                {...field}
                                value={field.value || ""}
                                placeholder="Enter ElevenLabs Voice ID"
                                className="bg-zinc-900/50 border-zinc-800 text-lg rounded-xl h-14 px-4"
                            />
                        )}
                    />
                </FormItemField>

                <FormItemField 
                    label="Model" 
                    error={configErrors?.model_id?.message}
                    hint="Choose the underlying AI model for generation."
                >
                    <Controller
                        control={control}
                        name="provider_config.model_id"
                        render={({ field }) => (
                            <FormSelect
                                options={models || []}
                                value={field.value || "eleven_multilingual_v2"}
                                onChange={field.onChange}
                                placeholder={isLoading ? "Loading models..." : "Select model..."}
                                renderTrigger={(selectedItems) => (
                                    <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 px-4 h-14 rounded-xl hover:border-zinc-700 transition-colors">
                                        <div className="text-zinc-400 group-hover/trigger:text-zinc-300 transition-colors">
                                            {isLoading ? <Spinner size="sm" color="current" /> : <Zap size={16} />}
                                        </div>
                                        <span className={cn(
                                            "text-lg font-bold transition-colors flex-1 text-left",
                                            selectedItems.length > 0 ? "text-white" : "text-zinc-600"
                                        )}>
                                            {selectedItems.length > 0 ? selectedItems[0].name : (isLoading ? "Loading models..." : "Select model...")}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-zinc-600" />
                                    </div>
                                )}
                            />
                        )}
                    />
                </FormItemField>
            </div>

            <div className="pt-8 border-t border-white/10 mt-4">
                <NativeAccordion 
                    title="Opcje Zaawansowane"
                    icon={<Settings2 size={18} className="text-zinc-400" />}
                >
                    <div className="mt-8 space-y-16 pb-8">
                        <div className="space-y-0">
                            <FormSubheading className="font-bold mb-2">
                                Parametry Syntezy
                            </FormSubheading>
                            <div className="h-px bg-white/10 w-full mb-12" />

                            <div className="grid grid-cols-1 gap-12">
                                <FormItemField 
                                    label="Stability" 
                                    error={configErrors?.stability?.message}
                                    hint="Lower: expressive | Higher: consistent."
                                >
                                    <Controller
                                        control={control}
                                        name="provider_config.stability"
                                        render={({ field }) => (
                                            <FormSlider
                                                value={field.value ?? 0.5}
                                                onChange={field.onChange}
                                                min={0}
                                                max={1}
                                                step={0.01}
                                                label="Stability"
                                            />
                                        )}
                                    />
                                </FormItemField>

                                <FormItemField 
                                    label="Similarity Boost" 
                                    error={configErrors?.similarity_boost?.message}
                                    hint="Higher: adheres closer to original voice."
                                >
                                    <Controller
                                        control={control}
                                        name="provider_config.similarity_boost"
                                        render={({ field }) => (
                                            <FormSlider
                                                value={field.value ?? 0.75}
                                                onChange={field.onChange}
                                                min={0}
                                                max={1}
                                                step={0.01}
                                                label="Similarity"
                                            />
                                        )}
                                    />
                                </FormItemField>

                                <FormItemField 
                                    label="Style Exaggeration" 
                                    error={configErrors?.style?.message}
                                    hint="Amplifies original speaker's style."
                                >
                                    <Controller
                                        control={control}
                                        name="provider_config.style"
                                        render={({ field }) => (
                                            <FormSlider
                                                value={field.value ?? 0.0}
                                                onChange={field.onChange}
                                                min={0}
                                                max={1}
                                                step={0.01}
                                                label="Style"
                                            />
                                        )}
                                    />
                                </FormItemField>

                                <FormItemField 
                                    label="Speaking Speed" 
                                    error={configErrors?.speed?.message}
                                    hint="0.7 (Slow) to 1.2 (Fast)."
                                >
                                    <Controller
                                        control={control}
                                        name="provider_config.speed"
                                        render={({ field }) => (
                                            <FormSlider
                                                value={field.value ?? 1.0}
                                                onChange={field.onChange}
                                                min={0.7}
                                                max={1.2}
                                                step={0.01}
                                                label="Speed"
                                            />
                                        )}
                                    />
                                </FormItemField>

                                <div className="flex flex-col justify-center pt-8 border-t border-white/5">
                                    <Controller
                                        control={control}
                                        name="provider_config.use_speaker_boost"
                                        render={({ field }) => (
                                            <div className="flex items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                                <div className="space-y-1">
                                                    <span className="text-base font-bold text-white">Speaker Boost</span>
                                                    <p className="text-sm text-zinc-500">Improves similarity to the original speaker (slight latency increase).</p>
                                                </div>
                                                <Switch
                                                    isSelected={field.value ?? true}
                                                    onValueChange={field.onChange}
                                                    size="md"
                                                    color="primary"
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </NativeAccordion>
            </div>
        </div>
    );
};
