"use client";

import { useState } from "react";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";
import { AutomationBrowserViewState, ViewMode } from "../types/automation-browser.types";

/**
 * useAutomationsView: Logic related strictly to the UI state of the browser.
 * Standard: No types declared in this file. All types imported from ../types/
 */
export const useAutomationsView = (): AutomationBrowserViewState => {
    const [viewMode, setViewMode] = useViewMode("automations", "grid") as [ViewMode, (mode: ViewMode) => void];
    const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleViewDetails = (automationId: string) => {
        setSelectedAutomationId(automationId);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    return {
        viewMode,
        setViewMode,
        selectedAutomationId,
        isSidebarOpen,
        setIsSidebarOpen,
        handleViewDetails,
        handleCloseSidebar
    };
};
