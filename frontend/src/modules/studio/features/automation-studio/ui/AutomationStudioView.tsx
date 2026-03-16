"use client";

import { X } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { AutomationSimulatorPanel } from "./components/AutomationSimulatorPanel";
import { AutomationSectionNav } from "./components/AutomationSectionNav";
import { AutomationAvailabilitySection } from "./sections/AutomationAvailabilitySection";
import { AutomationConnectionSection } from "./sections/AutomationConnectionSection";
import { AutomationAuthorizationSection } from "./sections/AutomationAuthorizationSection";
import { AutomationDefinitionSection } from "./sections/AutomationDefinitionSection";
import { AutomationContextSection } from "./sections/AutomationContextSection";
import { AutomationArtefactsSection } from "./sections/AutomationArtefactsSection";
import { AutomationStudioViewProps } from "../types/automation-studio.types";

/**
 * AutomationStudioView: Pure presentation layer for the automation studio.
 * Adheres to Pure View principle.
 */
export const AutomationStudioView = ({
    form,
    activeSectionIdentifier,
    onSectionClick,
    onCancel,
    onSave,
    setCanvasContainerReference,
    isEditing
}: AutomationStudioViewProps) => {
    return (
        <FormProvider {...form}>
            <div
                className="fixed inset-0 z-[200] h-screen w-screen bg-black outline-none"
                tabIndex={0}
            >
                <StudioLayout
                    canvasRef={setCanvasContainerReference}
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
                        <AutomationSectionNav
                            activeSection={activeSectionIdentifier}
                            onSectionClick={onSectionClick}
                            onExitToLibrary={onCancel}
                        />
                    }
                    canvas={
                        <div className="px-24 pb-48">
                            <form className="space-y-0" onSubmit={(submitEvent) => submitEvent.preventDefault()}>
                                <AutomationDefinitionSection />
                                <AutomationConnectionSection />
                                <AutomationAuthorizationSection />
                                <AutomationContextSection />
                                <AutomationArtefactsSection />
                                <AutomationAvailabilitySection />
                            </form>
                        </div>
                    }
                    poster={<AutomationSimulatorPanel />}
                    footer={
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onCancel}
                                className="hover:bg-zinc-900 h-9 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                            >
                                Anuluj
                            </Button>
                            <ActionButton
                                label={isEditing ? "Zaktualizuj" : "Zapisz"}
                                onClick={onSave}
                            />
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
