import { Prompt } from "../domain/schema";

export type PromptListViewProps = {
    readonly prompts: readonly Prompt[];
    readonly isLoading: boolean;
    readonly onSaved: () => void;
    readonly onDeleteClick: (id: string) => void;
    readonly promptToDeleteId: string | null;
    readonly onConfirmDelete: () => void;
    readonly onCancelDelete: () => void;
    readonly promptToDeleteTitle?: string;
};
