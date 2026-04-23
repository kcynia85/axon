"use client";

import React from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { ChevronDown, Mic } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { MetaAgentStudioData } from "../../types/meta-agent-schema";
import type { VoiceProvider } from "@/shared/domain/system";

import { ElevenLabsSettingsView } from "./providers/ElevenLabsSettingsView";
import { InworldAISettingsView } from "./providers/InworldAISettingsView";
import { CartesiaSettingsView } from "./providers/CartesiaSettingsView";
import { HyperscalerSettingsView } from "./providers/HyperscalerSettingsView";

const VoiceProviderSettingsRenderer = ({ provider }: { provider: VoiceProvider }) => {
    switch (provider) {
        case "ElevenLabs":
            return <ElevenLabsSettingsView />;
        case "Inworld_AI":
            return <InworldAISettingsView />;
        case "Cartesia":
            return <CartesiaSettingsView />;
        case "Google_Cloud":
        case "Microsoft_Azure":
        case "Amazon_Polly":
            return <HyperscalerSettingsView />;
        default:
            return null;
    }
};

export const MetaAgentVoiceSection = () => {
    const { control, formState: { errors }, setValue } = useFormContext<MetaAgentStudioData>();
    const currentProvider = useWatch({ control, name: "voice_provider" });

    const voiceProviders = [
        { id: "ElevenLabs", name: "ElevenLabs" },
        { id: "Inworld_AI", name: "Inworld AI" },
        { id: "Cartesia", name: "Cartesia" },
        { id: "Google_Cloud", name: "Google Cloud TTS" },
        { id: "Microsoft_Azure", name: "Microsoft Azure TTS" },
        { id: "Amazon_Polly", name: "Amazon Polly" },
    ];

    const handleProviderChange = (newProvider: VoiceProvider, onChange: (val: any) => void) => {
        // Change the provider value
        onChange(newProvider);
        
        // Reset provider config cleanly when provider changes
        setValue("provider_config", {}, { shouldValidate: true, shouldDirty: true });
    };

    return (
        <FormSection 
            id="voice" 
            number={4} 
            title="Voice & Speech"
            description="Configure speech-to-text and voice synthesis capabilities for the Meta-Agent."
            variant="island"
        >
            <div className="space-y-12 max-w-4xl">
                <FormItemField 
                    label="Voice Provider" 
                    error={errors.voice_provider?.message}
                    hint="Select the engine responsible for processing voice and generating speech."
                >
                    <Controller
                        control={control}
                        name="voice_provider"
                        render={({ field }) => (
                            <FormSelect
                                options={voiceProviders}
                                value={field.value}
                                onChange={(val) => handleProviderChange(val as VoiceProvider, field.onChange)}
                                placeholder="Select provider..."
                                renderTrigger={(selectedItems) => (
                                    <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover/trigger:bg-zinc-700 transition-colors">
                                            <Mic size={18} />
                                        </div>
                                        <span className={cn(
                                            "text-lg font-bold transition-colors flex-1 text-left",
                                            selectedItems.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                        )}>
                                            {selectedItems.length > 0 ? selectedItems[0].name : "Select provider..."}
                                        </span>
                                        <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                    </div>
                                )}
                            />
                        )}
                    />
                </FormItemField>

                {currentProvider && (
                    <VoiceProviderSettingsRenderer provider={currentProvider} />
                )}
            </div>
        </FormSection>
    );
};
