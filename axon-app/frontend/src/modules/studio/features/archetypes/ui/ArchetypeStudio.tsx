"use client";

import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { ArchetypeStudioView } from "./ArchetypeStudioView";
import { 
    ArchetypeStudioSectionId, 
    ARCHETYPE_STUDIO_SECTIONS 
} from "../types/archetype-studio.types";

const ARCHETYPE_STUDIO_SECTION_IDENTIFIERS: readonly ArchetypeStudioSectionId[] = [
    "IDENTITY",
    "MEMORY",
    "ACCESS"
];

export interface ArchetypeStudioProps {
	onSave: (data: any) => void;
	onCancel: () => void;
	form: any;
	archetypeId?: string;
	isSaving?: boolean;
	syncDraft?: () => void;
}

/**
 * ArchetypeStudio: Container component for the archetype studio.
 * Adheres to Pure View and Zero useEffect principles.
 * Standard: Container pattern, 0% co-located UI.
 */
export const ArchetypeStudio = ({ onSave, onCancel, form, archetypeId, syncDraft }: ArchetypeStudioProps) => {
    const { 
        activeSectionIdentifier, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier 
    } = useStudioScrollSpy<ArchetypeStudioSectionId>(
        ARCHETYPE_STUDIO_SECTION_IDENTIFIERS,
        "IDENTITY"
    );

    const handleSave = form.handleSubmit(onSave);

	return (
		<ArchetypeStudioView
            form={form}
            activeSectionIdentifier={activeSectionIdentifier}
            onSectionClick={scrollToSectionIdentifier}
            onExit={onCancel}
            onSave={handleSave}
            onBlur={syncDraft}
            setCanvasContainerReference={setCanvasContainerReference}
            sections={ARCHETYPE_STUDIO_SECTIONS}
            isEditing={!!archetypeId}
        />
    );
};
