import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { PromptFormData } from "../application/schemas";
import { Prompt } from "../domain/schema";

export type PromptEditorDialogViewProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly prompt?: Prompt;
    readonly trigger?: ReactNode;
    readonly form: UseFormReturn<PromptFormData>;
    readonly onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};
