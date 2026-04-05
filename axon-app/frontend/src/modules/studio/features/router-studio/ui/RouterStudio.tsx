import React from "react";
import type { RouterStudioProps } from "../types/router-studio.types";
import { RouterStudioView } from "./RouterStudioView";
import { useRouterForm } from "../application/hooks/useRouterForm";
import { ROUTER_STUDIO_SECTIONS, type RouterSectionIdentifier } from "../types/router.constants";
import { useRouterStudioSectionNav } from "../application/hooks/useRouterStudioSectionNav";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { toast } from "sonner";

export const RouterStudio = ({
	initialData,
	onSave,
	onCancel,
	isSaving = false
}: RouterStudioProps) => {
	const form = useRouterForm(initialData);
	const sectionIdentifiers = ROUTER_STUDIO_SECTIONS.map((section) => section.id);

	const { 
		activeSectionIdentifier, 
		setCanvasContainerReference, 
		scrollToSectionIdentifier 
	} = useStudioScrollSpy<string>(
		sectionIdentifiers,
		"general"
	);

	const { items: navigationItems } = useRouterStudioSectionNav({
		sections: ROUTER_STUDIO_SECTIONS,
		activeSection: activeSectionIdentifier as RouterSectionIdentifier,
		form: form as any
	});

	const handleOnSave = form.handleSubmit(
		(data: any) => {
			onSave(data as any);
		},
		(errors) => {
			console.error("Form validation errors:", errors);
			const firstError = Object.values(errors)[0];
			if (firstError) {
				toast.error("Proszę poprawić błędy w formularzu");
			}
		}
	);

	return (
		<RouterStudioView
			form={form as any}
			navigationItems={navigationItems}
			activeSectionIdentifier={activeSectionIdentifier as RouterSectionIdentifier}
			onSectionClick={scrollToSectionIdentifier as any}
			onSave={handleOnSave}
			onCancel={onCancel}
			isSaving={isSaving}
			setCanvasContainerReference={setCanvasContainerReference}
		/>
	);
};
