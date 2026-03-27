import React, { useCallback, useRef, useState } from "react";
import type { RouterStudioProps } from "../types/router-studio.types";
import { RouterStudioView } from "./RouterStudioView";
import { useRouterForm } from "../application/hooks/useRouterForm";
import { ROUTER_STUDIO_SECTIONS, type RouterSectionIdentifier } from "../types/router.constants";
import { useRouterStudioSectionNav } from "../application/hooks/useRouterStudioSectionNav";

export const RouterStudio = ({
	initialData,
	onSave,
	onCancel,
	isSaving = false
}: RouterStudioProps) => {
	const form = useRouterForm(initialData);
	const [activeSection, setActiveSection] = useState<RouterSectionIdentifier>("general");
	const canvasContainerRef = useRef<HTMLElement | null>(null);

	const { items: navigationItems } = useRouterStudioSectionNav({
		sections: ROUTER_STUDIO_SECTIONS,
		activeSection,
		form
	});

	const handleSectionClick = useCallback((sectionId: RouterSectionIdentifier) => {
		const element = document.getElementById(sectionId);
		if (element && canvasContainerRef.current) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
			setActiveSection(sectionId);
		}
	}, []);

	const setCanvasContainerReference = useCallback((node: HTMLElement | null) => {
		canvasContainerRef.current = node;
	}, []);

	const handleOnSave = form.handleSubmit((data) => {
		onSave(data);
	});

	return (
		<RouterStudioView
			form={form}
			navigationItems={navigationItems}
			activeSectionIdentifier={activeSection}
			onSectionClick={handleSectionClick}
			onSave={handleOnSave}
			onCancel={onCancel}
			isSaving={isSaving}
			setCanvasContainerReference={setCanvasContainerReference}
		/>
	);
};
