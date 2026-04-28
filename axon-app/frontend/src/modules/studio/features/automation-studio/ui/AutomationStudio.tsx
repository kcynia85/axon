"use client";

import { useEffect } from "react";
import { useAutomationForm } from "../application/useAutomationForm";
import { AutomationStudioSectionId } from "../types/sections.constants";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { AutomationStudioView } from "./AutomationStudioView";

import { toast } from "sonner";

import { FieldErrors } from "react-hook-form";
import { AutomationFormData } from "../types/automation-schema";

const AUTOMATION_STUDIO_SECTION_IDENTIFIERS: readonly AutomationStudioSectionId[] = [
    "definition",
    "context",
    "artefacts",
    "availability"
];

export type AutomationStudioProps = {
    readonly onSave: (data: AutomationFormData) => void;
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
        (data: AutomationFormData) => {
            console.log("Form data valid, submitting:", data);
            onSave(data);
        },
        (errors: FieldErrors<AutomationFormData>) => {
            console.error("FULL Form validation errors:", JSON.stringify(errors, null, 2));
            
            // Extract messages even from nested objects
            const getErrors = (validationErrorsObject: any): string[] => {
                let messages: string[] = [];
                if (!validationErrorsObject) return messages;

                if (validationErrorsObject.message) {
                    messages.push(validationErrorsObject.message);
                }

                if (typeof validationErrorsObject === 'object') {
                    for (const key in validationErrorsObject) {
                        const nested = validationErrorsObject[key];
                        if (nested) {
                            messages = [...messages, ...getErrors(nested)];
                        }
                    }
                }
                return messages;
            };

            const errorMessages = Array.from(new Set(getErrors(errors))); // Unique messages
            
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
