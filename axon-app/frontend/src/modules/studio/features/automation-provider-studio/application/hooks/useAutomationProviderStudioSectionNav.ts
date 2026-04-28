"use client";

import { useMemo } from "react";
import { AUTOMATION_PROVIDER_STUDIO_SECTIONS, type AutomationProviderStudioSectionId } from "../../types/sections.constants";
import type { AutomationProviderFormData } from "../../types/automation-provider-schema";

type SectionProgress = "complete" | "current" | "pending";

export type NavSectionItem = {
	readonly id: AutomationProviderStudioSectionId;
	readonly title: string;
	readonly subtitle: string;
	readonly number: number;
	readonly progress: SectionProgress;
};

type UseAutomationProviderStudioSectionNavProps = {
	readonly form: any; // React Hook Form instance
	readonly activeSection: AutomationProviderStudioSectionId;
};

export const useAutomationProviderStudioSectionNav = ({
	form,
	activeSection,
}: UseAutomationProviderStudioSectionNavProps) => {
	const getProgress = (id: AutomationProviderStudioSectionId): SectionProgress => {
		if (id === activeSection) return "current";

		const data = form.getValues() as AutomationProviderFormData;
		switch (id) {
			case "identity":
				return data.platform ? "complete" : "pending";
			case "auth":
				return data.auth_type ? "complete" : "pending";
			default:
				return "pending";
		}
	};

	const items: readonly NavSectionItem[] = useMemo(
		() =>
			AUTOMATION_PROVIDER_STUDIO_SECTIONS.map((section) => ({
				...section,
				progress: getProgress(section.id),
			})),
		[activeSection, form.formState.isDirty],
	);

	return { items };
};
