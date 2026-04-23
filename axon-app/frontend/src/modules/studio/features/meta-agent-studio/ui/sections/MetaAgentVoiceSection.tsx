"use client";

import React from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { ChevronDown, Mic, UserCircle, Zap, AudioLines } from "lucide-react";
import { SiGooglecloud } from "react-icons/si";
import { TbBrandAzure, TbBrandAws } from "react-icons/tb";
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
        { id: "ElevenLabs", name: "ElevenLabs", icon: <Mic size={18} /> },
        { id: "Inworld_AI", name: "Inworld AI", icon: <UserCircle size={18} /> },
        { id: "Cartesia", name: "Cartesia", icon: <AudioLines size={18} /> },
        { id: "Google_Cloud", name: "Google Cloud TTS", icon: <SiGooglecloud size={18} /> },
        { id: "Microsoft_Azure", name: "Microsoft Azure TTS", icon: <TbBrandAzure size={18} /> },
        { id: "Amazon_Polly", name: "Amazon Polly", icon: <TbBrandAws size={18} /> },
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
                                    <div className="flex items-center gap-4 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 h-16 rounded-2xl hover:border-zinc-700 transition-colors">
                                        <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 group-hover/trigger:bg-zinc-700 transition-colors shadow-inner border border-white/5">
                                            {selectedItems.length > 0 ? selectedItems[0].icon : <Mic size={20} />}
                                        </div>
                                        <div className="flex flex-col flex-1 text-left">
                                            <span className={cn(
                                                "text-[15px] font-black transition-colors tracking-tight",
                                                selectedItems.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                            )}>
                                                {selectedItems.length > 0 ? selectedItems[0].name : "Select provider..."}
                                            </span>
                                            {selectedItems.length > 0 && (
                                                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none mt-0.5">
                                                    Active Engine
                                                </span>
                                            )}
                                        </div>
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
