"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { X, ExternalLink } from "lucide-react";
import { ProviderStudioViewProps } from "../types/provider-studio.types";
import { ProviderStudioSectionNav } from "./components/ProviderStudioSectionNav";
import { ProviderTypeSelectionSection } from "./sections/ProviderTypeSelectionSection";
import { ProviderAuthSection } from "./sections/ProviderAuthSection";
import { ProviderTokenizationSection } from "./sections/ProviderTokenizationSection";
import { ProviderJsonSchemaSection } from "./sections/ProviderJsonSchemaSection";
import { ProviderApiAdapterSection } from "./sections/ProviderApiAdapterSection";

/**
 * ProviderStudioView: Pure presentation component for the Provider Studio.
 * Standard: 0% Logic, 0% useEffect, 0% Business state.
 */
export const ProviderStudioView = ({
    form,
    navigationItems,
    activeSectionIdentifier,
    onSectionClick,
    onSave,
    onCancel,
    setCanvasContainerReference,
    isSaving
}: ProviderStudioViewProps) => {
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
                        <ProviderStudioSectionNav
                            sections={navigationItems as any}
                            activeSection={activeSectionIdentifier}
                            onSectionClick={onSectionClick}
                            onExitToLibrary={onCancel}
                        />
                    }
                    canvas={
                        <div className="px-24 pb-48">
                            <form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
                                <ProviderAuthSection />
                                <ProviderTypeSelectionSection />
                                <ProviderTokenizationSection />
                                <ProviderJsonSchemaSection />
                                <ProviderApiAdapterSection />
                            </form>
                        </div>
                    }
                    poster={
                        <div className="h-full w-full flex flex-col items-center justify-center p-12 text-center space-y-8 bg-zinc-950/50 backdrop-blur-3xl rounded-3xl border border-zinc-900">
                             <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center border-4 border-zinc-900">
                                <ExternalLink className="w-12 h-12 text-zinc-500" />
                             </div>
                             <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase tracking-widest text-white">Live Connection</h3>
                                <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                                    Konfiguracja jest testowana w czasie rzeczywistym. Axon weryfikuje połączenie z endpointem po wpisaniu danych.
                                </p>
                             </div>
                        </div>
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
