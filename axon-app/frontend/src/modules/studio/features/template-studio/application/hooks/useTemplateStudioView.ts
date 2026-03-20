import { useState, useRef, useCallback, useMemo } from "react";
import { TEMPLATE_STUDIO_SECTIONS, type TemplateStudioSectionId } from "../../types/template-studio.constants";
import type { TemplateStudioFormData } from "../../types/template-studio.types";

export const useTemplateStudioView = () => {
	const [activeSection, setActiveSection] = useState<TemplateStudioSectionId>("definition");
	const canvasRef = useRef<HTMLDivElement>(null);

	const scrollToSection = useCallback((sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element && canvasRef.current) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
			setActiveSection(sectionId as TemplateStudioSectionId);
		}
	}, []);

	const navigationItems = useMemo(() => {
		return TEMPLATE_STUDIO_SECTIONS.map((section) => ({
			...section,
			isActive: activeSection === section.id,
			progress: { current: 0, total: 0 },
		}));
	}, [activeSection]);

	return {
		activeSection,
		setActiveSection,
		canvasRef,
		scrollToSection,
		navigationItems,
	};
};
