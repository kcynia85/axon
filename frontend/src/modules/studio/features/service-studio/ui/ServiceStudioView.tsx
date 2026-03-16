"use client";

import { X } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { ServiceStudioSectionNav } from "./components/ServiceStudioSectionNav";
import { ServiceLivePoster } from "./components/ServiceLivePoster";
import { ServiceBasicInfoSection } from "./sections/ServiceBasicInfoSection";
import { ServiceCategoriesSection } from "./sections/ServiceCategoriesSection";
import { ServiceCapabilitiesSection } from "./sections/ServiceCapabilitiesSection";
import { ServiceAvailabilitySection } from "./sections/ServiceAvailabilitySection";
import { ServiceStudioViewProps } from "../types/service-studio.types";

/**
 * ServiceStudioView: Pure presentation layer for the service studio.
 * Adheres to Pure View principle.
 */
export const ServiceStudioView = ({
    form,
    activeSectionIdentifier,
    onSectionClick,
    onCancel,
    onSave,
    setCanvasContainerReference,
    isEditing
}: ServiceStudioViewProps) => {
    return (
        <FormProvider {...form}>
            <div className="fixed inset-0 z-[200] h-screen w-screen bg-black outline-none" tabIndex={0}>
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
                        <ServiceStudioSectionNav
                            activeSection={activeSectionIdentifier}
                            onSectionClick={onSectionClick}
                            onExitToLibrary={onCancel}
                        />
                    }
                    canvas={
                        <div className="px-24 pb-48">
                            <form className="space-y-0" onSubmit={(submitEvent) => submitEvent.preventDefault()}>
                                <ServiceBasicInfoSection />
                                <ServiceCategoriesSection />
                                <ServiceCapabilitiesSection />
                                <ServiceAvailabilitySection />
                            </form>
                        </div>
                    }
                    poster={<ServiceLivePoster />}
                    footer={
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onCancel}
                                className="hover:bg-zinc-900 h-9 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                            >
                                Cancel
                            </Button>
                            <ActionButton
                                label={isEditing ? "Update Service" : "Register Service"}
                                onClick={onSave}
                            />
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
