import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormSlider } from "@/shared/ui/form/FormSlider";
import { Switch } from "@heroui/react";
import type { MetaAgentStudioData } from "../../../types/meta-agent-schema";

export const ElevenLabsSettingsView = () => {
    const { control, formState: { errors } } = useFormContext<MetaAgentStudioData>();
    
    // Safety check for errors
    const configErrors = errors.provider_config as Record<string, any> | undefined;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                            className="bg-zinc-900/50 border-zinc-800 text-lg rounded-xl h-12 px-4"
                        />
                    )}
                />
            </FormItemField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItemField 
                    label="Stability" 
                    error={configErrors?.stability?.message}
                    hint="Lower values make the voice more expressive."
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
                    hint="Higher values make it sound more like the original."
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

                <div className="flex flex-col justify-center">
                    <Controller
                        control={control}
                        name="provider_config.use_speaker_boost"
                        render={({ field }) => (
                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-white">Speaker Boost</span>
                                    <p className="text-xs text-zinc-500">Boost the similarity of the speaker.</p>
                                </div>
                                <Switch
                                    isSelected={field.value ?? true}
                                    onValueChange={field.onChange}
                                    size="sm"
                                    color="primary"
                                />
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
