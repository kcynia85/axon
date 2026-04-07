import { ReactNode } from "react";

export type PromptArchetypesListViewProps = {
    readonly archetypes: readonly any[];
    readonly draft: any | null;
    readonly isLoading: boolean;
    readonly onDeleteClick: (id: string) => void;
    readonly onEditClick: (id: string) => void;
    readonly archetypeToDeleteId: string | null;
    readonly onConfirmDelete: () => void;
    readonly onCancelDelete: () => void;
    readonly archetypeToDeleteName?: string;
};
