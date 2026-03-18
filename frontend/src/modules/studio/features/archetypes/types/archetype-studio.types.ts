import { ArchetypeFormValues } from "../application/archetypeSchema";

export type ArchetypeStudioSectionId = "IDENTITY" | "MEMORY" | "ACCESS";

export type ArchetypeStudioViewProps = {
    readonly form: any;
    readonly activeSectionIdentifier: ArchetypeStudioSectionId;
    readonly onSectionClick: (sectionIdentifier: ArchetypeStudioSectionId) => void;
    readonly onExit: () => void;
    readonly onSave: () => void;
    readonly onBlur?: () => void;
    readonly setCanvasContainerReference: (scrollContainerNode: HTMLDivElement | null) => void;
    readonly sections: readonly { id: ArchetypeStudioSectionId; title: string; number: number }[];
    readonly isEditing?: boolean;
};

export const ARCHETYPE_STUDIO_SECTIONS = [
    { id: "IDENTITY" as const, title: "Tożsamość", number: 1 },
    { id: "MEMORY" as const, title: "Pamięć i Rozumowanie", number: 2 },
    { id: "ACCESS" as const, title: "Dostępność", number: 3 },
] as const;
