import React, { useCallback, useRef, useState } from "react";
import { ModelStudioView } from "./ModelStudioView";
import { useModelForm } from "../application/hooks/useModelForm";
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
];

export const ModelStudio = ({
	initialData,
	onSave,
	onCancel,
	isSaving = false,
}: ModelStudioProps) => {
	const form = useModelForm(initialData);
	const [activeSection, setActiveSection] = useState("identity");
	const canvasContainerRef = useRef<HTMLElement | null>(null);

	const handleSectionClick = useCallback((sectionId: string) => {
		setActiveSection(sectionId);
		const element = document.getElementById(sectionId);
		if (element) {
			const container = element.closest('.overflow-y-auto') || window;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + (container instanceof Window ? window.scrollY : container.scrollTop) - 100;

			container.scrollTo({
				top: offsetPosition,
				behavior: "smooth"
			});
		}
	}, []);

	const setCanvasContainerReference = useCallback((node: HTMLElement | null) => {
		canvasContainerRef.current = node;
	}, []);

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
			navigationItems={NAVIGATION_ITEMS}
			activeSection={activeSection}
			onSectionClick={handleSectionClick}
			onSave={handleOnSave}
			onCancel={onCancel}
			isSaving={isSaving}
			setCanvasContainerReference={setCanvasContainerReference}
		/>
	);
};