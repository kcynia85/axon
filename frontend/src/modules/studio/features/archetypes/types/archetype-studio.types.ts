import { ArchetypeFormValues } from "../application/archetypeSchema";
import { ArchetypeStudioSectionId } from "../application/useArchetypeStudioView";

export type ArchetypeStudioViewProps = {
    readonly form: any;
    readonly activeSectionIdentifier: ArchetypeStudioSectionId;
    readonly onSectionClick: (sectionIdentifier: ArchetypeStudioSectionId) => void;
    readonly onExit: () => void;
    readonly onSave: () => void;
    readonly setCanvasContainerReference: (scrollContainerNode: HTMLDivElement | null) => void;
    readonly sections: readonly { id: ArchetypeStudioSectionId; title: string; number: number }[];
};
