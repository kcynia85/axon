import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { TEMPLATE_STUDIO_SECTIONS, type TemplateStudioSectionId } from "../../types/template-studio.constants";

export const useTemplateStudioView = () => {
	const sectionIdentifiers = TEMPLATE_STUDIO_SECTIONS.map((section) => section.id);

	const {
		activeSectionIdentifier,
		setCanvasContainerReference,
		scrollToSectionIdentifier,
	} = useStudioScrollSpy<string>(sectionIdentifiers, "definition");

	const navigationItems = TEMPLATE_STUDIO_SECTIONS.map((section) => ({
		...section,
		isActive: activeSectionIdentifier === section.id,
		progress: { current: 0, total: 0 },
	}));

	return {
		activeSection: activeSectionIdentifier as TemplateStudioSectionId,
		canvasRef: setCanvasContainerReference,
		scrollToSection: scrollToSectionIdentifier,
		navigationItems,
	};
};
