import { UseFormReturn } from "react-hook-form";
import { PromptArchetypeFormData } from "./prompt-archetype-editor.types";

export type PromptArchetypeEditorProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
};

export type PromptArchetypeEditorViewProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly form: UseFormReturn<PromptArchetypeFormData>;
    readonly isCreating: boolean;
    readonly onSubmit: (data: PromptArchetypeFormData) => void;
};

export type PromptArchetypeSectionProps = {
    readonly form: UseFormReturn<PromptArchetypeFormData>;
};
