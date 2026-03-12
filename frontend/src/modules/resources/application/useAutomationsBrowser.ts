"use client";

import { useMemo } from "react";
import { Automation } from "@/shared/domain/resources";
import { useAutomationsQuery } from "./useAutomationsQuery";
import { useAutomationsFilter } from "./useAutomationsFilter";
import { useAutomationsView } from "./useAutomationsView";
import { AutomationBrowserFacade } from "../types/automation-facade.types";

/**
 * useAutomationsBrowser: Facade hook that orchestrates data fetching, filtering, and UI state.
 * Refactored to adhere to SRP, DDD, and standard naming.
 * Standard: No types declared in this file. All types imported from ../types/
 */
export const useAutomationsBrowser = (initialAutomations: readonly Automation[] = []): AutomationBrowserFacade => {
    // 1. Data Fetching Logic
    const { automations, isLoading, isError } = useAutomationsQuery(initialAutomations);
    
    // 2. Business Logic (Filtering and Sorting)
    const { processedAutomations, filterConfiguration } = useAutomationsFilter({ automations });
    
    // 3. UI/View Management Logic
    const viewState = useAutomationsView();

    const selectedAutomation = useMemo(() => 
        automations.find((automation) => automation.id === viewState.selectedAutomationId) || null,
    [automations, viewState.selectedAutomationId]);

    const recentlyUsedAutomations = useMemo(() => {
        return automations.slice(0, 3);
    }, [automations]);

    return {
        automations,
        processedAutomations,
        recentlyUsedAutomations,
        selectedAutomation,
        isLoading,
        isError,
        filterConfiguration,
        ...viewState
    };
};
