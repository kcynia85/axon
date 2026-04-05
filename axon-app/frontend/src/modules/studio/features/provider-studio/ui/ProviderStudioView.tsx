"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { X, Globe, Activity } from "lucide-react";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { ProviderStudioViewProps } from "../types/provider-studio.types";
import { ProviderStudioSectionNav } from "./components/ProviderStudioSectionNav";
import { ProviderSanityCheck } from "./components/ProviderSanityCheck";
import { ProviderAuthSection } from "./sections/ProviderAuthSection";
import { ProviderTypeSelectionSection } from "./sections/ProviderTypeSelectionSection";
import { ProviderTokenizationSection } from "./sections/ProviderTokenizationSection";
import { ProviderJsonSchemaSection } from "./sections/ProviderJsonSchemaSection";
import { ProviderApiAdapterSection } from "./sections/ProviderApiAdapterSection";

export const ProviderStudioView = ({
    form,
    navigationItems,
    activeSectionIdentifier,
    onSectionClick,
    onSave,
    onCancel,
    isSaving,
    isValid,
    isDirty,
    providerId,
    setCanvasContainerReference,
}: ProviderStudioViewProps) => {
    return (
        <FormProvider {...form}>
            <div className="h-full w-full outline-none" tabIndex={0}>
                <StudioLayout
                    studioLabel="Provider"
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
                        <ProviderStudioSectionNav
                            sections={navigationItems as any}
                            activeSection={activeSectionIdentifier}
                            onSectionClick={onSectionClick}
                            onExitToLibrary={onCancel}
                        />
                    }
                    canvas={
                        <div className="px-16 pb-48 pt-20 w-full">
                            <form className="space-y-16 w-full" onSubmit={(formEvent) => formEvent.preventDefault()}>
                                <ProviderAuthSection providerId={providerId} />
                                <ProviderTypeSelectionSection />
                                <ProviderTokenizationSection />

                                <ProviderJsonSchemaSection />
                                <ProviderApiAdapterSection />
                            </form>
                        </div>
                    }
                    poster={
                        <ProviderSanityCheck 
                            providerId={providerId || ""} 
                            isValid={isValid}
                            isDirty={isDirty}
                        />
                    }
                    footer={
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={onCancel}
                                className="hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                            >
                                Anuluj
                            </Button>
                            <ActionButton
                                label="Zapisz Dostawcę"
                                onClick={onSave}
                                loading={isSaving}
                            />
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
