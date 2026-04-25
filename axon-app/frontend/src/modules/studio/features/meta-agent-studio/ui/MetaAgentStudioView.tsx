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
import { MetaAgentLivePoster } from "./components/MetaAgentLivePoster";

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
                    poster={<MetaAgentLivePoster />}
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
