"use client";

import React from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { ChevronDown, Mic, UserCircle, Zap, AudioLines, MessageSquare, Radio } from "lucide-react";
import { SiGooglecloud } from "react-icons/si";
import { TbBrandAzure, TbBrandAws } from "react-icons/tb";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/ui/Badge";
import type { MetaAgentStudioData } from "../../types/meta-agent-schema";
import type { VoiceProvider } from "@/shared/domain/system";

import { ElevenLabsSettingsView } from "./providers/ElevenLabsSettingsView";
import { InworldAISettingsView } from "./providers/InworldAISettingsView";
import { CartesiaSettingsView } from "./providers/CartesiaSettingsView";
import { HyperscalerSettingsView } from "./providers/HyperscalerSettingsView";

const ElevenLabsIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="4" width="3" height="16" rx="1.5" />
        <rect x="14" y="4" width="3" height="16" rx="1.5" />
    </svg>
);

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
        { id: "ElevenLabs", name: "ElevenLabs", icon: <ElevenLabsIcon size={18} /> },
        { id: "Inworld_AI", name: "Inworld AI", disabled: true, badgeLabel: "soon" },
        { id: "Cartesia", name: "Cartesia", disabled: true, badgeLabel: "soon" },
        { id: "Google_Cloud", name: "Google Cloud TTS", disabled: true, badgeLabel: "soon" },
        { id: "Microsoft_Azure", name: "Microsoft Azure TTS", disabled: true, badgeLabel: "soon" },
        { id: "Amazon_Polly", name: "Amazon Polly", disabled: true, badgeLabel: "soon" },
    ];

    const interactionModes = [
        { id: "LIVE_CONVERSATION", name: "Live Conversation", description: "Full bidirectional voice chat with the Meta-Agent.", icon: <MessageSquare size={18} />, disabled: true, badgeLabel: "soon" },
        { id: "STT_ONLY", name: "Speech-to-Text Only", description: "Meta-Agent only transcribes your speech into the chat input.", icon: <Radio size={18} /> },
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
        >
            <div className="space-y-12">
                <div className="flex flex-col gap-10 p-10 bg-white/5 border border-white/5 rounded-[32px] shadow-2xl relative overflow-hidden group/island">
                    <div className="flex flex-col gap-8 relative z-10">
                        <FormItemField 
                            label="Voice Provider" 
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
                                        showSearch={false}
                                        placeholder="Select provider..."
                                        renderTrigger={(selectedItems) => (
                                            <div className="flex items-center gap-4 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 h-16 rounded-2xl hover:border-zinc-700 transition-colors">
                                                <div className="p-2.5 rounded-xl bg-zinc-800 group-hover/trigger:bg-zinc-700 transition-colors shadow-inner border border-white/5">
                                                    {selectedItems.length > 0 ? selectedItems[0].icon : <Mic size={20} className="text-zinc-400" />}
                                                </div>
                                                <div className="flex flex-col flex-1 text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "text-[15px] font-black transition-colors tracking-tight",
                                                            selectedItems.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                                        )}>
                                                            {selectedItems.length > 0 ? selectedItems[0].name : "Select provider..."}
                                                        </span>
                                                        {selectedItems[0]?.badgeLabel && (
                                                            <Badge variant="outline" className="text-[10px] py-0 h-4 border-zinc-700 text-zinc-500 uppercase font-black">
                                                                {selectedItems[0].badgeLabel}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                            </div>
                                        )}
                                    />
                                )}
                            />
                        </FormItemField>

                        <FormItemField 
                            label="Interaction Mode" 
                            hint="Choose if the agent should respond with voice or just transcribe."
                        >
                            <Controller
                                control={control}
                                name="interaction_mode"
                                render={({ field }) => (
                                    <FormSelect
                                        options={interactionModes}
                                        value={field.value || "STT_ONLY"}
                                        onChange={field.onChange}
                                        showSearch={false}
                                        placeholder="Select mode..."
                                        renderTrigger={(selectedItems) => (
                                            <div className="flex items-center gap-4 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 h-16 rounded-2xl hover:border-zinc-700 transition-colors">
                                                <div className="p-2.5 rounded-xl bg-zinc-800 group-hover/trigger:bg-zinc-700 transition-colors shadow-inner border border-white/5">
                                                    {selectedItems.length > 0 ? selectedItems[0].icon : <MessageSquare size={20} className="text-zinc-400" />}
                                                </div>
                                                <div className="flex flex-col flex-1 text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "text-[15px] font-black transition-colors tracking-tight",
                                                            selectedItems.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                                        )}>
                                                            {selectedItems.length > 0 ? selectedItems[0].name : "Select mode..."}
                                                        </span>
                                                        {selectedItems[0]?.badgeLabel && (
                                                            <Badge variant="outline" className="text-[10px] py-0 h-4 border-zinc-700 text-zinc-500 uppercase font-black">
                                                                {selectedItems[0].badgeLabel}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                            </div>
                                        )}
                                    />
                                )}
                            />
                        </FormItemField>
                    </div>

                    {currentProvider && (
                        <div className="pt-10 border-t border-white/10 mt-2 relative z-10">
                             <VoiceProviderSettingsRenderer provider={currentProvider} />
                        </div>
                    )}
                </div>
            </div>
        </FormSection>
    );
};
