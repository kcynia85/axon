"use client";

import React from "react";
import { UseFormReturn, FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { GenericStudioSectionNav } from "@/modules/studio/ui/components/StudioSectionNav/GenericStudioSectionNav";
import { Button } from "@/shared/ui/ui/Button";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { BrainCircuit, X, ChevronRight } from "lucide-react";
import { MetaAgentStudioData } from "../types/meta-agent-schema";
import { LLMModel } from "@/shared/domain/settings";

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
                            <div className="p-6 bg-zinc-950/40 border border-white/5 rounded-3xl space-y-6">
                                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl w-fit">
                                    <BrainCircuit size={32} className="text-purple-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight text-white">Cognitive Orchestrator</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed">
                                        The Meta-Agent is the brain of your Axon instance. It manages communication, task delegation, and system-wide awareness.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Capability</span>
                                        <span className="text-sm font-mono text-zinc-300 block">Level 5</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Status</span>
                                        <span className="text-sm font-mono text-green-400 block flex items-center gap-1">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">Knowledge Bases</h4>
                                <div className="space-y-2">
                                    {["System Awareness", "Entity Registry", "Logic Manifest"].map((kb) => (
                                        <div key={kb} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                                            <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{kb}</span>
                                            <ChevronRight size={14} className="text-zinc-600" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                    footer={
                        <div className="flex items-center justify-between w-full px-8">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Status</span>
                                    <span className="text-sm font-mono text-blue-400 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                        Configuration Session
                                    </span>
                                </div>
                            </div>
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
