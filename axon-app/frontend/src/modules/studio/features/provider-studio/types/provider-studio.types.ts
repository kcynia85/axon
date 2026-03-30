import { UseFormReturn } from "react-hook-form";
import { ProviderFormData } from "./provider-schema";
import { ProviderStudioSectionId } from "./sections.constants";

export type ProviderStudioProps = {
	providerId?: string;
	initialData?: Partial<ProviderFormData>;
	onSave: (data: ProviderFormData) => void;
	onCancel: () => void;
	isSaving?: boolean;
};

export type ProviderStudioViewProps = {
	form: UseFormReturn<ProviderFormData>;
	navigationItems: readonly any[];
	activeSectionIdentifier: ProviderStudioSectionId;
	onSectionClick: (sectionId: ProviderStudioSectionId) => void;
	onCancel: () => void;
	onSave: () => void;
	isSaving: boolean;
	isValid: boolean;
	isDirty: boolean;
	providerId?: string;
	setCanvasContainerReference: (node: HTMLElement | null) => void;
};
