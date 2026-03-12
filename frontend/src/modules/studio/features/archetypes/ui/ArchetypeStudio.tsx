"use client";

import { useArchetypeStudioView, ArchetypeStudioSectionId } from "../application/useArchetypeStudioView";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { ArchetypeStudioView } from "./ArchetypeStudioView";

const ARCHETYPE_STUDIO_SECTION_IDENTIFIERS: readonly ArchetypeStudioSectionId[] = [
    "IDENTITY",
    "MEMORY",
    "ACCESS"
];

/**
 * ArchetypeStudio: Container component for the archetype studio.
 * Adheres to Pure View and Zero useEffect principles.
 * Standard: Container pattern, 0% co-located UI.
 */
export const ArchetypeStudio = () => {
	const {
		form,
		handleSubmit,
		handleExit,
		sections,
	} = useArchetypeStudioView();

    const { 
        activeSectionIdentifier, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier 
    } = useStudioScrollSpy<ArchetypeStudioSectionId>(
        ARCHETYPE_STUDIO_SECTION_IDENTIFIERS,
        "IDENTITY"
    );

    const handleSave = form.handleSubmit(handleSubmit);

	return (
		<ArchetypeStudioView
            form={form}
            activeSectionIdentifier={activeSectionIdentifier}
            onSectionClick={scrollToSectionIdentifier}
            onExit={handleExit}
            onSave={handleSave}
            setCanvasContainerReference={setCanvasContainerReference}
            sections={sections}
        />
	);
};
