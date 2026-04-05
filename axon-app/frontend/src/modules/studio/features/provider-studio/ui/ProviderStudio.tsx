"use client";

import React from "react";
import { ProviderStudioProps } from "../types/provider-studio.types";
import { ProviderStudioView } from "./ProviderStudioView";
import { useProviderForm } from "../application/hooks/useProviderForm";
import { PROVIDER_STUDIO_SECTIONS } from "../types/sections.constants";
import { useProviderStudioSectionNav } from "../application/hooks/useProviderStudioSectionNav";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";

export const ProviderStudio = ({
	providerId,
	initialData,
	onSave,
	onCancel,
	isSaving = false,
}: ProviderStudioProps) => {
	const form = useProviderForm(initialData);
	const sectionIdentifiers = PROVIDER_STUDIO_SECTIONS.map((section) => section.id);

	const {
		activeSectionIdentifier,
		setCanvasContainerReference,
		scrollToSectionIdentifier,
	} = useStudioScrollSpy<string>(sectionIdentifiers, "auth");

	const { items: navigationItems } = useProviderStudioSectionNav({
		sections: PROVIDER_STUDIO_SECTIONS,
		activeSection: activeSectionIdentifier as any,
		form: form as any,
	});

	const handleOnSave = form.handleSubmit((data) => {
		onSave(data);
	});

	return (
		<ProviderStudioView
			form={form as any}
			navigationItems={navigationItems}
			activeSectionIdentifier={activeSectionIdentifier as any}
			onSectionClick={scrollToSectionIdentifier as any}
			onSave={handleOnSave}
			onCancel={onCancel}
			isSaving={isSaving}
			isValid={form.formState.isValid}
			isDirty={form.formState.isDirty}
			providerId={providerId}
			setCanvasContainerReference={setCanvasContainerReference}
		/>
	);
};
