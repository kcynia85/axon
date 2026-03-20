import { AutomationFormData } from "./automation-schema";
import { AutomationStudioSectionId } from "./sections.constants";

export type AutomationStudioProps = {
    readonly onSave: (data: AutomationFormData) => void;
    readonly onCancel: () => void;
    readonly initialData?: Partial<AutomationFormData>;
    readonly isEditing?: boolean;
};

export type AutomationStudioViewProps = {
    readonly form: any;
    readonly activeSectionIdentifier: AutomationStudioSectionId;
    readonly onSectionClick: (sectionIdentifier: AutomationStudioSectionId) => void;
    readonly onCancel: () => void;
    readonly onSave: () => void;
    readonly setCanvasContainerReference: (scrollContainerNode: HTMLDivElement | null) => void;
    readonly isEditing?: boolean;
};
