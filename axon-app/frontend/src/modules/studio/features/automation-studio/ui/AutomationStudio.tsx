"use client";

import { useEffect } from "react";
import { useAutomationForm } from "../application/useAutomationForm";
import { AutomationStudioSectionId } from "../types/sections.constants";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { AutomationStudioView } from "./AutomationStudioView";

import { toast } from "sonner";

const AUTOMATION_STUDIO_SECTION_IDENTIFIERS: readonly AutomationStudioSectionId[] = [
    "definition",
    "connection",
    "authorization",
    "context",
    "artefacts",
    "availability"
];

export type AutomationStudioProps = {
    readonly onSave: (data: any) => void;
    readonly onCancel: () => void;
    readonly form: any;
    readonly isEditing?: boolean;
    readonly isSaving?: boolean;
    readonly syncDraft?: () => void;
};

/**
 * AutomationStudio: Container component for the automation studio.
 * Adheres to Pure View and Zero useEffect principles.
 * Standard: Container pattern, 0% co-located UI.
 */
export const AutomationStudio = ({ onSave, onCancel, form, isEditing, syncDraft }: AutomationStudioProps) => {
    const { 
        activeSectionIdentifier, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier 
    } = useStudioScrollSpy<AutomationStudioSectionId>(
        AUTOMATION_STUDIO_SECTION_IDENTIFIERS,
        "definition"
    );

    const handleSave = form.handleSubmit(
        (data) => {
            console.log("Form data valid, submitting:", data);
            onSave(data);
        },
        (errors) => {
            console.error("Form validation errors:", errors);
            
            // Extract messages even from nested objects (definition.name, connection.url etc)
            const getErrors = (obj: any): string[] => {
                let messages: string[] = [];
                for (const key in obj) {
                    if (obj[key]?.message) {
                        messages.push(obj[key].message);
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        messages = [...messages, ...getErrors(obj[key])];
                    }
                }
                return messages;
            };

            const errorMessages = getErrors(errors);
            
            const message = errorMessages.length > 0 
                ? `Błędy: ${errorMessages.join(", ")}` 
                : "Formularz zawiera błędy. Sprawdź wymagane pola.";
                
            toast.error(message);
        }
    );

    return (
        <AutomationStudioView
            form={form}
            activeSectionIdentifier={activeSectionIdentifier}
            onSectionClick={scrollToSectionIdentifier}
            onCancel={onCancel}
            onSave={handleSave}
            onBlur={syncDraft}
            setCanvasContainerReference={setCanvasContainerReference}
            isEditing={isEditing}
        />
    );
};
