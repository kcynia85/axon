import { UseFormReturn } from "react-hook-form";
import { RouterFormData } from "./router-schema";
import { RouterSectionIdentifier } from "./router.constants";

export type RouterStudioProps = {
	initialData?: Partial<RouterFormData>;
	onSave: (data: RouterFormData) => void;
	onCancel: () => void;
	isSaving?: boolean;
};

export type RouterStudioViewProps = {
	form: UseFormReturn<RouterFormData>;
	navigationItems: readonly any[];
	activeSectionIdentifier: RouterSectionIdentifier;
	onSectionClick: (sectionId: RouterSectionIdentifier) => void;
	onCancel: () => void;
	onSave: () => void;
	isSaving: boolean;
	setCanvasContainerReference: (node: HTMLElement | null) => void;
};
