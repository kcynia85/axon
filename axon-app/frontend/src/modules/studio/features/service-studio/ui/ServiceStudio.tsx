"use client";

import { useServiceForm } from "../application/useServiceForm";
import { ServiceStudioSectionId } from "../types/sections.constants";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { ServiceStudioView } from "./ServiceStudioView";

const SERVICE_STUDIO_SECTION_IDENTIFIERS: readonly ServiceStudioSectionId[] = [
    "basic-info",
    "categories",
    "capabilities",
    "availability"
];

export type ServiceStudioProps = {
    readonly onSave: (data: any) => void;
    readonly onCancel: () => void;
    readonly form: any;
    readonly isEditing?: boolean;
    readonly isSaving?: boolean;
    readonly syncDraft?: () => void;
};

/**
 * ServiceStudio: Container component for the service studio.
 * Adheres to Pure View and Zero useEffect principles.
 * Standard: Container pattern, 0% co-located UI.
 */
export const ServiceStudio = ({ onSave, onCancel, form, isEditing, syncDraft }: ServiceStudioProps) => {
    const { 
        activeSectionIdentifier, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier 
    } = useStudioScrollSpy<ServiceStudioSectionId>(
        SERVICE_STUDIO_SECTION_IDENTIFIERS,
        "basic-info"
    );

    const handleSave = form.handleSubmit(onSave as any);

    return (
        <ServiceStudioView
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
