"use client";

import { X } from "lucide-react";
import * as React from "react";
import { FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { ProjectStudioSectionNav } from "./components/ProjectStudioSectionNav";
import { ProjectStudioViewProps } from "../types/project-studio-ui.types";
import { IdentitySection } from "./sections/IdentitySection";
import { SpaceSection } from "./sections/SpaceSection";
import { ResourcesSection } from "./sections/ResourcesSection";
import { ArtefactsSection } from "./sections/ArtefactsSection";

export const ProjectStudioView = ({
    form,
    onExit,
    onSave,
    onSyncDraft,
    onKeyDown,
    activeSectionIdentifier,
    onSectionClick,
    sections,
    setCanvasContainerReference,
    isEditing,
    ...rest
}: ProjectStudioViewProps) => {
    return (
        <FormProvider {...form}>
            <div
                onKeyDown={onKeyDown}
                className="outline-none h-full w-full"
                tabIndex={0}
            >
                <StudioLayout
                    studioLabel="Project"
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
                        <ProjectStudioSectionNav
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
                                onSubmit={(formEvent) => formEvent.preventDefault()}
                            >
                                <IdentitySection syncDraft={onSyncDraft} />
                                <ResourcesSection 
                                    syncDraft={onSyncDraft} 
                                    linkFields={rest.linkFields}
                                    onAppend={rest.appendLink}
                                    onRemove={rest.removeLink}
                                />
                                <SpaceSection 
                                    syncDraft={onSyncDraft} 
                                    projectName={rest.projectName} 
                                    spaceIds={rest.spaceIds}
                                    usedSpaceIds={rest.usedSpaceIds}
                                    generateNewSpace={rest.generateNewSpace}
                                    isOpen={rest.isSpaceModalOpen}
                                    onOpen={rest.onOpenSpaceModal}
                                    onClose={rest.onCloseSpaceModal}
                                    onSelect={rest.onSelectSpace}
                                    onCreateNew={rest.onCreateNewSpace}
                                    onRemove={rest.onRemoveSpace}
                                />
                                <ArtefactsSection projectId={rest.projectId} />
                            </form>
                        </div>
                    }
                    poster={
                        <div className="flex flex-col items-center justify-center h-full p-8 text-zinc-500 font-mono text-xs uppercase tracking-widest text-center opacity-50">
                            Project Live View
                        </div>
                    }
                    footer={
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onExit}
                                className="hover:bg-zinc-900 h-9 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                            >
                                Anuluj
                            </Button>
                            <ActionButton
                                label={isEditing ? "Zaktualizuj Projekt" : "Zapisz Projekt"}
                                onClick={onSave}
                            />
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
