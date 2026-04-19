import { UseFormReturn, FieldArrayWithId } from "react-hook-form";
import { CreateProjectFormData } from "@/modules/projects/application/schemas";
import { ProjectStudioSectionId, ProjectStudioStep } from "./project-studio.types";
import { ProjectSectionConfig } from "./hooks.types";

export type ProjectStudioViewProps = {
    readonly form: UseFormReturn<CreateProjectFormData>;
    readonly step: ProjectStudioStep;
    readonly onExit: () => void;
    readonly onSave: () => void;
    readonly onSyncDraft: () => void;
    readonly onKeyDown: (keyboardEvent: React.KeyboardEvent) => void;
    readonly activeSectionIdentifier: ProjectStudioSectionId;
    readonly onSectionClick: (sectionIdentifier: ProjectStudioSectionId) => void;
    readonly sections: readonly ProjectSectionConfig[];
    readonly setCanvasContainerReference: (scrollContainerNode: HTMLDivElement | null) => void;
    readonly isEditing?: boolean;
    
    // Additional props from CreateProjectDialogView
    readonly linkFields: FieldArrayWithId<CreateProjectFormData, "links", "id">[];
    readonly appendLink: (value: { url: string }) => void;
    readonly removeLink: (index: number) => void;
    readonly projectName: string;
    readonly currentKeywords: readonly string[];
    readonly keywordInput: string;
    readonly handleKeywordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readonly handleKeywordKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readonly removeKeyword: (keyword: string) => void;
    readonly isSpaceModalOpen: boolean;
    readonly onOpenSpaceModal: () => void;
    readonly onCloseSpaceModal: () => void;
    readonly onSelectSpace: (id: string) => void;
    readonly onCreateNewSpace: () => void;
    readonly onRemoveSpace: (id: string) => void;
    readonly spaceIds: readonly string[];
    readonly usedSpaceIds: readonly string[];
    readonly generateNewSpace: boolean;
    readonly projectId?: string;
};
