"use client";

import { useServiceForm } from "../application/useServiceForm";
import { ServiceStudioSectionId } from "../types/sections.constants";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { ServiceStudioView } from "./ServiceStudioView";
import { ServiceStudioProps } from "../types/service-studio.types";

const SERVICE_STUDIO_SECTION_IDENTIFIERS: readonly ServiceStudioSectionId[] = [
    "basic-info",
    "categories",
    "capabilities",
    "availability"
];

/**
 * ServiceStudio: Container component for the service studio.
 * Adheres to Pure View and Zero useEffect principles.
 * Standard: Container pattern, 0% co-located UI.
 */
export const ServiceStudio = ({ onSave, onCancel, initialData, isEditing }: ServiceStudioProps) => {
    const { form } = useServiceForm(initialData);
    
    const { 
        activeSectionIdentifier, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier 
    } = useStudioScrollSpy<ServiceStudioSectionId>(
        SERVICE_STUDIO_SECTION_IDENTIFIERS,
        "basic-info"
    );

    const handleSave = form.handleSubmit(onSave);

    return (
        <ServiceStudioView
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
