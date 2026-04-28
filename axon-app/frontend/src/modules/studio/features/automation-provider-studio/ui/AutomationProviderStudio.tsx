"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { AutomationProviderStudioProps } from "../types/automation-provider-studio.types";
import { AutomationProviderStudioView } from "./AutomationProviderStudioView";
import { AUTOMATION_PROVIDER_STUDIO_SECTIONS, AutomationProviderStudioSectionId } from "../types/sections.constants";
import {
	automationProviderFormSchema,
	AutomationProviderFormData,
} from "../types/automation-provider-schema";

import { toast } from "sonner";

export const AutomationProviderStudio = ({
	providerId,
	onSave,
	onCancel,
	initialData,
	isSaving,
}: AutomationProviderStudioProps) => {
	const form = useForm<AutomationProviderFormData>({
		resolver: zodResolver(automationProviderFormSchema) as any,
		values: (initialData || {
			platform: "N8N",
			base_url: "",
			auth_type: "HEADER",
			auth_header_name: "Authorization",
			auth_secret: "",
		}) as any,
		mode: "onChange",
	});

	const {
		activeSectionIdentifier,
		setCanvasContainerReference,
		scrollToSectionIdentifier,
	} = useStudioScrollSpy<AutomationProviderStudioSectionId>(
		AUTOMATION_PROVIDER_STUDIO_SECTIONS.map((s) => s.id),
		"identity",
	);

	const handleSave = form.handleSubmit(
		async (data: AutomationProviderFormData) => {
			console.log("Form data is valid, calling onSave", data);
			await onSave(data);
		},
		(errors) => {
			console.error("Validation errors in AutomationProviderStudio:", errors);
			// Display the first error message in a toast
			const firstError = Object.values(errors)[0];
			if (firstError?.message) {
				toast.error(String(firstError.message));
			} else {
				toast.error("Formularz zawiera błędy. Sprawdź wymagane pola.");
			}
		}
	);

	return (
		<AutomationProviderStudioView
			form={form}
			activeSectionIdentifier={activeSectionIdentifier}
			onSectionClick={scrollToSectionIdentifier}
			onCancel={onCancel}
			onSave={handleSave}
			setScrollContainer={setCanvasContainerReference}
			isEditing={!!providerId}
			isSaving={isSaving}
		/>
	);
};
