"use client";

import { useAutomationForm } from "../application/useAutomationForm";
import { AutomationStudioSectionId } from "../types/sections.constants";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { AutomationStudioView } from "./AutomationStudioView";
import { AutomationStudioProps } from "../types/automation-studio.types";

const AUTOMATION_STUDIO_SECTION_IDENTIFIERS: readonly AutomationStudioSectionId[] = [
    "definition",
    "connection",
    "authorization",
    "context",
    "artefacts",
    "availability"
];

/**
 * AutomationStudio: Container component for the automation studio.
 * Adheres to Pure View and Zero useEffect principles.
 * Standard: Container pattern, 0% co-located UI.
 */
export const AutomationStudio = ({ onSave, onCancel, initialData, isEditing }: AutomationStudioProps) => {
    const { form } = useAutomationForm(initialData);
    
    const { 
        activeSectionIdentifier, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier 
    } = useStudioScrollSpy<AutomationStudioSectionId>(
        AUTOMATION_STUDIO_SECTION_IDENTIFIERS,
        "definition"
    );

    const handleSave = form.handleSubmit(onSave);

    return (
        <AutomationStudioView
            form={form}
            activeSectionIdentifier={activeSectionIdentifier}
            onSectionClick={scrollToSectionIdentifier}
            onCancel={onCancel}
            onSave={handleSave}
            setCanvasContainerReference={setCanvasContainerReference}
            isEditing={isEditing}
        />
    );
};
