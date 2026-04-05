import React from "react";
import { ModelStudioView } from "./ModelStudioView";
import { useModelForm } from "../application/hooks/useModelForm";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import type { ModelFormData } from "../types/model-schema";
import { toast } from "sonner";

interface ModelStudioProps {
	modelId?: string;
	initialData?: Partial<ModelFormData>;
	onSave: (data: ModelFormData) => void;
	onCancel: () => void;
	isSaving?: boolean;
}

const NAVIGATION_ITEMS = [
	{ id: "identity", label: "Tożsamość", number: 1 },
	{ id: "parameters", label: "Parametry Dostawcy", number: 2 },
	{ id: "custom-params", label: "Parametry Niestandardowe", number: 3 },
	{ id: "system-prompt", label: "Globalne Instrukcje", number: 4 },
	{ id: "pricing", label: "Ekonomia", number: 5 },
] as const;

export const ModelStudio = ({
	modelId,
	initialData,
	onSave,
	onCancel,
	isSaving = false,
}: ModelStudioProps) => {
	const form = useModelForm(initialData);
	
	const sectionIdentifiers = NAVIGATION_ITEMS.map(item => item.id);
	
	const { 
		activeSectionIdentifier, 
		setCanvasContainerReference, 
		scrollToSectionIdentifier 
	} = useStudioScrollSpy<string>(
		sectionIdentifiers,
		"identity"
	);

	const handleOnSave = form.handleSubmit(
		(data) => {
			onSave(data);
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
		<ModelStudioView
			form={form}
			modelId={modelId}
			navigationItems={NAVIGATION_ITEMS as any}
			activeSection={activeSectionIdentifier}
			onSectionClick={scrollToSectionIdentifier}
			onSave={handleOnSave}
			onCancel={onCancel}
			isSaving={isSaving}
			setCanvasContainerReference={setCanvasContainerReference}
		/>
	);
};