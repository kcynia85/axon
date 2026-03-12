import { usePromptArchetypes } from "./usePromptArchetypes";
import { PromptArchetype } from "@/shared/domain/resources";

/**
 * usePromptsQuery: Encapsulates data fetching for prompt archetypes.
 */
export const usePromptsQuery = (initialPrompts: readonly PromptArchetype[] = []) => {
    const { data: prompts = initialPrompts, isLoading, isError } = usePromptArchetypes();

    return {
        prompts,
        isLoading,
        isError
    };
};
