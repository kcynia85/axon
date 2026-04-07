"use client";

import { X } from "lucide-react";
import * as React from "react";
import { FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { ArchetypeSectionNav } from "./components/ArchetypeSectionNav";
import { ArchetypeIdentitySection } from "./sections/ArchetypeIdentitySection";
import { ArchetypeMemorySection } from "./sections/ArchetypeMemorySection";
import { ArchetypeAccessSection } from "./sections/ArchetypeAccessSection";
import { ArchetypeStudioViewProps } from "../types/archetype-studio.types";

/**
 * ArchetypeStudioView: Pure presentation layer for the archetype studio.
 * Adheres to Pure View principle.
 */
export const ArchetypeStudioView = ({
    form,
    activeSectionIdentifier,
    onSectionClick,
    onExit,
    onSave,
    onBlur,
    setCanvasContainerReference,
    sections,
    isEditing
}: ArchetypeStudioViewProps) => {
    const emptyPoster = <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-zinc-600 font-mono text-xs">Archetype Preview</div>;

    return (
        <FormProvider {...form}>
            <div className="outline-none h-full w-full" tabIndex={0}>
                <StudioLayout
                    studioLabel="Archetype"
                    canvasRef={setCanvasContainerReference}
                    exitButton={
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onExit}
                            className="hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all h-9 w-9"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    }
                    navigator={
                        <ArchetypeSectionNav
                            sections={sections as any}
                            activeSection={activeSectionIdentifier}
                            onSectionClick={onSectionClick}
                            onExitToLibrary={onExit}
                        />
                    }
                    canvas={
                        <div className="px-16 pb-48 pt-20 w-full">
                            <form 
                                className="space-y-16 w-full" 
                                onSubmit={(submitEvent) => submitEvent.preventDefault()}
                            >
                                <ArchetypeIdentitySection syncDraft={onBlur} />
                                <ArchetypeMemorySection syncDraft={onBlur} />
                                <ArchetypeAccessSection syncDraft={onBlur} />
                            </form>
                        </div>
                    }
                    poster={emptyPoster}
                    footer={
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={onExit}
                                className="hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                            >
                                Anuluj
                            </Button>
                            <ActionButton
                                label={isEditing ? "Aktualizuj Archetyp" : "Zapisz Archetyp"}
                                onClick={onSave}
                            />
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
