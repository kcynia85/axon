"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePromptArchetype } from "../application/usePromptArchetypes";
import { 
    PromptArchetypeFormData, 
    CreatePromptArchetypeFormSchema,
    PromptArchetypeEditorLogic
} from "../types/prompt-archetype-editor.types";

/**
 * usePromptArchetypeEditor: Encapsulates the logic for creating prompt archetypes.
 * Standard: 0% co-located types, 0% useEffect.
 */
export const usePromptArchetypeEditor = (onSuccess: () => void): PromptArchetypeEditorLogic => {
    const { mutateAsync: createArchetype, isPending: isCreating } = useCreatePromptArchetype();

    const form = useForm<PromptArchetypeFormData>({
        resolver: zodResolver(CreatePromptArchetypeFormSchema) as unknown as Resolver<PromptArchetypeFormData>,
        defaultValues: {
            archetype_name: "",
            archetype_description: "",
            archetype_role: "",
            archetype_goal: "",
            archetype_backstory: "",
            archetype_guardrails: {
                instructions: [],
                constraints: [],
            },
            archetype_keywords: [],
            workspace_domain: "General",
        },
    });

    const handleFormSubmit = async (data: PromptArchetypeFormData) => {
        try {
            await createArchetype(data);
            onSuccess();
            form.reset();
        } catch (error) {
            console.error("Failed to create archetype:", error);
        }
    };

    return {
        form,
        isCreating,
        handleFormSubmit,
    };
};
