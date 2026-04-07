"use client";

import React from "react";
import { useCrewForm } from "../application/useCrewForm";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { CrewStudioView } from "./CrewStudioView";
import type { CrewStudioFormData } from "../types/crew-schema";
import { CREW_STUDIO_SECTIONS, type CrewStudioSectionId } from "../types/sections.constants";

export interface AvailableAgent {
    id: string;
    name: string;
    subtitle?: string;
    avatarUrl?: string;
}

interface Props {
    availableAgents: AvailableAgent[];
    onSave: (data: CrewStudioFormData) => void;
    onCancel: () => void;
    onSyncDraft?: (data: CrewStudioFormData) => void;
    initialData?: Partial<CrewStudioFormData>;
    isSaving?: boolean;
}

/**
 * CrewStudio: Container component for the Crew Studio.
 * Adheres to Pure View and Zero useEffect principles.
 * Standard: Container pattern, 0% UI declaration.
 */
export const CrewStudio = ({ 
    availableAgents, 
    onSave, 
    onCancel, 
    onSyncDraft,
    initialData, 
    isSaving 
}: Props) => {
    const { 
        form, 
        estimatedCost, 
        handleTypeChange, 
        currentType, 
        syncDraft 
    } = useCrewForm(initialData, onSyncDraft);

    // Navigation items with dynamic titles based on type - No useMemo
    const navigationItems = CREW_STUDIO_SECTIONS.map(section => {
        let title = section.title;

        if (section.id === "execution") {
            if (currentType === "Hierarchical") title = "Lead & Team";
            if (currentType === "Parallel") title = "Team Members (Agents)";
            if (currentType === "Sequential") title = "Sequence of Tasks";
        }

        return {
            ...section,
            title,
        };
    });

    const sectionIdentifiers = navigationItems.map(item => item.id as CrewStudioSectionId);

    const { 
        activeSectionIdentifier, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier 
    } = useStudioScrollSpy<CrewStudioSectionId>(
        sectionIdentifiers,
        "basic-info"
    );

    const handleSave = form.handleSubmit(onSave);

    return (
        <CrewStudioView 
            form={form}
            availableAgents={availableAgents}
            navigationItems={navigationItems}
            activeSectionIdentifier={activeSectionIdentifier}
            estimatedCost={estimatedCost}
            onSectionClick={scrollToSectionIdentifier}
            onTypeChange={handleTypeChange}
            onSave={handleSave}
            onCancel={onCancel}
            onSyncDraft={syncDraft}
            setCanvasContainerReference={setCanvasContainerReference}
            isSaving={isSaving}
        />
    );
};
