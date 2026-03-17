import { UseFormReturn } from "react-hook-form";
import { CrewStudioFormData } from "./crew-schema";
import { CrewStudioSectionId } from "./sections.constants";

export type UseCrewFormResult = {
	readonly form: UseFormReturn<CrewStudioFormData>;
	readonly currentType: CrewStudioFormData["crew_process_type"];
	readonly estimatedCost: number;
	readonly handleTypeChange: (type: CrewStudioFormData["crew_process_type"]) => void;
	readonly syncDraft: () => void;
	readonly clearDraft: () => void;
};

export type AvailableAgent = {
    readonly id: string;
    readonly name: string;
    readonly subtitle?: string;
    readonly avatarUrl?: string;
};

export type CrewStudioContainerProps = {
    readonly workspaceId: string;
    readonly availableAgents: readonly AvailableAgent[];
    readonly initialData?: Partial<CrewStudioFormData>;
};

export type CrewStudioViewProps = {
    readonly form: UseFormReturn<CrewStudioFormData>;
    readonly availableAgents: readonly AvailableAgent[];
    readonly navigationItems: readonly { id: string; title: string }[];
    readonly activeSectionIdentifier: CrewStudioSectionId;
    readonly estimatedCost: number;
    readonly onSectionClick: (sectionId: string) => void;
    readonly onTypeChange: (type: CrewStudioFormData["crew_process_type"]) => void;
    readonly onSave: () => void;
    readonly onCancel: () => void;
    readonly onSyncDraft: () => void;
    readonly setCanvasContainerReference: (node: HTMLDivElement | null) => void;
    readonly isSaving?: boolean;
};
