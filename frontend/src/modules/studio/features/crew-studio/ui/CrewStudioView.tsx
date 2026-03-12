"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { X } from "lucide-react";
import { CrewStudioViewProps } from "../types/crew-studio.types";
import { CrewStudioSectionNav } from "./components/CrewStudioSectionNav";
import { CrewLiveGraphContainer } from "./components/CrewLiveGraphContainer";
import { CrewBasicInfoSection } from "./sections/CrewBasicInfoSection";
import { CrewTypeSelectionSection } from "./sections/CrewTypeSelectionSection";
import { CrewExecutionSection } from "./sections/CrewExecutionSection";
import { CrewContextSection } from "./sections/CrewContextSection";
import { CrewArtefactsSection } from "./sections/CrewArtefactsSection";
import { CrewAvailabilitySection } from "./sections/CrewAvailabilitySection";

/**
 * CrewStudioView: Pure presentation component for the Crew Studio.
 * Standard: 0% Logic, 0% useEffect, 0% Business state.
 */
export const CrewStudioView = ({
    form,
    availableAgents,
    navigationItems,
    activeSectionIdentifier,
    estimatedCost,
    onSectionClick,
    onTypeChange,
    onSave,
    onCancel,
    setCanvasContainerReference,
    isSaving
}: CrewStudioViewProps) => {
    return (
        <FormProvider {...form}>
            <div className="h-full w-full outline-none" tabIndex={0}>
                <StudioLayout
                    canvasRef={setCanvasContainerReference as any}
                    exitButton={
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            className="hover:bg-zinc-900 gap-2 text-zinc-400 hover:text-white px-4 font-mono text-[10px] uppercase tracking-[0.2em] border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
                        >
                            <X className="w-4 h-4" /> Exit Studio
                        </Button>
                    }
                    navigator={
                        <CrewStudioSectionNav
                            sections={navigationItems as any}
                            activeSection={activeSectionIdentifier}
                            onSectionClick={onSectionClick}
                            onExitToLibrary={onCancel}
                        />
                    }
                    canvas={
                        <div className="px-24 pb-48">
                            <form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
                                <CrewBasicInfoSection />
                                <CrewTypeSelectionSection onTypeChange={onTypeChange} />
                                <CrewExecutionSection availableAgents={availableAgents as any} />
                                <CrewContextSection />
                                <CrewArtefactsSection />
                                <CrewAvailabilitySection />
                            </form>
                        </div>
                    }
                    poster={<CrewLiveGraphContainer availableAgents={availableAgents as any} />}
                    footer={
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end mr-8">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Estimated Cost</span>
                                <span className="text-xl font-black text-primary font-mono">${estimatedCost.toFixed(2)}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onCancel}
                                className="hover:bg-zinc-900 h-9 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                            >
                                Cancel
                            </Button>
                            <ActionButton
                                label="Save Team"
                                onClick={onSave}
                                isLoading={isSaving}
                            />
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
