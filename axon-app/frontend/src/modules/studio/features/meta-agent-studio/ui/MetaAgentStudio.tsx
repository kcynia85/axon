"use client";

import React from "react";
import { MetaAgentStudioView } from "./MetaAgentStudioView";
import { useMetaAgentForm } from "../application/useMetaAgentForm";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { MetaAgentStudioData } from "../types/meta-agent-schema";
import { LLMModel } from "@/shared/domain/settings";
import { toast } from "sonner";

interface Props {
    initialData?: Partial<MetaAgentStudioData>;
    onSave: (data: MetaAgentStudioData) => void;
    onCancel: () => void;
    isSaving?: boolean;
    llmModels?: LLMModel[];
    isLoadingModels?: boolean;
}

const NAVIGATION_ITEMS = [
    { id: "identity", label: "Core Identity" },
    { id: "reasoning", label: "Cognitive Engine" },
    { id: "awareness", label: "System Awareness" },
    { id: "voice", label: "Voice & Speech" },
] as const;

export const MetaAgentStudio = ({
    initialData,
    onSave,
    onCancel,
    isSaving = false,
    llmModels,
    isLoadingModels
}: Props) => {
    const form = useMetaAgentForm(initialData);
    
    const sectionIdentifiers = NAVIGATION_ITEMS.map(item => item.id);
    
    const { 
        activeSectionIdentifier, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier 
    } = useStudioScrollSpy<string>(
        sectionIdentifiers as unknown as string[],
        "identity"
    );

    const handleOnSave = form.handleSubmit(
        (data) => {
            onSave(data);
        },
        (errors) => {
            console.error("Form validation errors:", errors);
            const firstError = Object.values(errors)[0];
            if (firstError) {
                toast.error("Please correct the errors in the form");
            }
        }
    );

    return (
        <MetaAgentStudioView
            form={form}
            navigationItems={NAVIGATION_ITEMS as any}
            activeSection={activeSectionIdentifier}
            onSectionClick={scrollToSectionIdentifier}
            onSave={handleOnSave}
            onCancel={onCancel}
            isSaving={isSaving}
            setCanvasContainerReference={setCanvasContainerReference as any}
            llmModels={llmModels}
            isLoadingModels={isLoadingModels}
        />
    );
};
