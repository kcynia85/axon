"use client";

import React, { useState } from "react";
import { UseFormReturn, FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { GenericStudioSectionNav } from "@/modules/studio/ui/components/StudioSectionNav/GenericStudioSectionNav";
import { Button } from "@/shared/ui/ui/Button";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { BrainCircuit, X, ChevronRight, Mic } from "lucide-react";
import { MetaAgentStudioData } from "../types/meta-agent-schema";
import { LLMModel } from "@/shared/domain/settings";
import { useVoiceInteraction } from "@/modules/spaces/application/useVoiceInteraction";
import { cn } from "@/shared/lib/utils";

import { MetaAgentIdentitySection } from "./sections/MetaAgentIdentitySection";
import { MetaAgentEngineSection } from "./sections/MetaAgentEngineSection";
import { MetaAgentAwarenessSection } from "./sections/MetaAgentAwarenessSection";
import { MetaAgentVoiceSection } from "./sections/MetaAgentVoiceSection";

interface Props {
    form: UseFormReturn<MetaAgentStudioData>;
    navigationItems: Array<{ id: string; label: string }>;
    activeSection: string;
    onSectionClick: (id: string) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
    setCanvasContainerReference: (el: HTMLDivElement | null) => void;
    llmModels?: LLMModel[];
}

export const MetaAgentStudioView = ({
    form,
    navigationItems,
    activeSection,
    onSectionClick,
    onSave,
    onCancel,
    isSaving,
    setCanvasContainerReference,
    llmModels,
}: Props) => {
    const [testTranscription, setTestTranscription] = useState("");

    const {
        isRecording,
        isProcessing,
        toggleRecording
    } = useVoiceInteraction((text) => {
        setTestTranscription(text);
    });

    return (
        <FormProvider {...form}>
            <div className="h-full w-full outline-none" tabIndex={0}>
                <StudioLayout
                    studioLabel="Meta-Agent"
                    canvasRef={setCanvasContainerReference as any}
                    exitButton={
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onCancel}
                            className="hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all h-9 w-9"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    }
                    navigator={
                        <GenericStudioSectionNav
                            sections={navigationItems}
                            activeSection={activeSection}
                            onSectionClick={onSectionClick}
                        />
                    }
                    canvas={
                        <div className="px-16 pb-48 pt-20 w-full">
                            <form className="space-y-16 w-full" onSubmit={(formEvent) => formEvent.preventDefault()}>
                                <MetaAgentIdentitySection />
                                <MetaAgentEngineSection llmModels={llmModels} />
                                <MetaAgentAwarenessSection />
                                <MetaAgentVoiceSection />
                            </form>
                        </div>
                    }
                    poster={
                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">Voice Sandbox</h4>
                                <div className="p-4 bg-zinc-950/40 border border-white/5 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleRecording();
                                            }}
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 border shadow-sm",
                                                isRecording
                                                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                                    : "bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10 hover:text-zinc-300",
                                                isProcessing && "opacity-50 cursor-wait pointer-events-none"
                                            )}
                                            title={isRecording ? "Stop Recording" : "Voice Input"}
                                        >
                                            {isProcessing ? (
                                                <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
                                            ) : (
                                                <Mic size={20} />
                                            )}
                                        </button>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">
                                                {isRecording ? "Listening..." : isProcessing ? "Processing..." : "STT Connection"}
                                            </p>
                                            <p className="text-xs text-zinc-500 truncate">
                                                {isRecording ? "Speak now..." : "Test speech-to-text"}
                                            </p>
                                        </div>
                                    </div>
                                    {testTranscription && (
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <p className="text-xs text-zinc-300 font-mono italic leading-relaxed">
                                                "{testTranscription}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    }
                    footer={
                        <div className="flex items-center justify-end w-full px-8">
                            <div className="flex items-center gap-6">
                                <Button 
                                    variant="ghost" 
                                    onClick={onCancel}
                                    className="text-zinc-500 hover:text-white hover:bg-white/5 font-bold h-11 px-6 font-mono text-base tracking-widest"
                                >
                                    Anuluj
                                </Button>
                                <ActionButton 
                                    label="Save Meta-Agent"
                                    onClick={onSave}
                                    loading={isSaving}
                                />
                            </div>
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
