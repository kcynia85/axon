"use client";

import { useState } from "react";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";
import { PromptsBrowserViewState, PromptsViewMode } from "../types/prompts-browser.types";

/**
 * usePromptsView: Logic related strictly to the UI state of the prompts browser.
 * Standard: 0% co-located types, 0% useEffect.
 */
export const usePromptsView = (): PromptsBrowserViewState => {
    const [viewMode, setViewMode] = useViewMode("prompts", "grid") as [PromptsViewMode, (mode: PromptsViewMode) => void];
    const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleViewDetails = (promptId: string) => {
        setSelectedPromptId(promptId);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    return {
        viewMode,
        setViewMode,
        selectedPromptId,
        isSidebarOpen,
        setIsSidebarOpen,
        handleViewDetails,
        handleCloseSidebar
    };
};
