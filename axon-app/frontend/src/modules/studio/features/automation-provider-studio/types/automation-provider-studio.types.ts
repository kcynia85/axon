import { AutomationProviderStudioSectionId } from "./sections.constants";
import { AutomationProviderFormData } from "./automation-provider-schema";

export type AutomationProviderStudioProps = {
    readonly providerId?: string;
    readonly onSave: (data: AutomationProviderFormData) => void;
    readonly onCancel: () => void;
    readonly initialData?: Partial<AutomationProviderFormData>;
    readonly isSaving?: boolean;
};

export type AutomationProviderStudioViewProps = {
    readonly form: any;
    readonly activeSectionIdentifier: AutomationProviderStudioSectionId;
    readonly onSectionClick: (sectionId: AutomationProviderStudioSectionId) => void;
    readonly onCancel: () => void;
    readonly onSave: () => void;
    readonly setScrollContainer: (node: HTMLDivElement | null) => void;
    readonly isEditing: boolean;
    readonly isSaving?: boolean;
};
