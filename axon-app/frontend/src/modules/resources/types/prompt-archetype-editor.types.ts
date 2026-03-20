import { z } from "zod";
import { PromptArchetypeSchema } from "@/shared/domain/resources";

export const CreatePromptArchetypeFormSchema = PromptArchetypeSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});

export type PromptArchetypeFormData = z.infer<typeof CreatePromptArchetypeFormSchema>;

export type PromptArchetypeEditorLogic = {
    readonly form: any;
    readonly isCreating: boolean;
    readonly handleFormSubmit: (data: PromptArchetypeFormData) => Promise<void>;
};
