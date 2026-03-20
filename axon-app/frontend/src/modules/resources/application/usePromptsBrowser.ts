"use client";

import { useMemo } from "react";
import { PromptArchetype } from "@/shared/domain/resources";
import { usePromptsQuery } from "./usePromptsQuery";
import { usePromptsFilter } from "./usePromptsFilter";
import { usePromptsView } from "./usePromptsView";
import { PromptsBrowserFacade } from "../types/prompts-browser.types";

/**
 * usePromptsBrowser: Facade hook that orchestrates data fetching, filtering, and UI state for prompts.
 * Refactored to adhere to SRP, DDD, and standard naming.
 */
export const usePromptsBrowser = (initialPrompts: readonly PromptArchetype[] = []): PromptsBrowserFacade => {
    // 1. Data Fetching Logic
    const { prompts, isLoading, isError } = usePromptsQuery(initialPrompts);
    
    // 2. Business Logic (Filtering and Sorting)
    const { processedPrompts, filterConfiguration } = usePromptsFilter({ prompts });
    
    // 3. UI/View Management Logic
    const viewState = usePromptsView();

    const selectedPrompt = useMemo(() => 
        prompts.find((prompt) => prompt.id === viewState.selectedPromptId) || null,
    [prompts, viewState.selectedPromptId]);

    const recentlyUsedPrompts = useMemo(() => {
        return prompts.slice(0, 3);
    }, [prompts]);

    return {
        prompts,
        processedPrompts,
        recentlyUsedPrompts,
        selectedPrompt,
        isLoading,
        isError,
        filterConfiguration,
        ...viewState
    };
};
