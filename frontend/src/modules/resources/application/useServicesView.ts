"use client";

import { useState } from "react";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";
import { ServicesBrowserViewState, ServicesViewMode } from "../types/services-browser.types";

/**
 * useServicesView: Logic related strictly to the UI state of the services browser.
 * Standard: 0% co-located types, 0% useEffect.
 */
export const useServicesView = (): ServicesBrowserViewState => {
    const [viewMode, setViewMode] = useViewMode("services", "grid") as [ServicesViewMode, (mode: ServicesViewMode) => void];
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleViewDetails = (serviceId: string) => {
        setSelectedServiceId(serviceId);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    return {
        viewMode,
        setViewMode,
        selectedServiceId,
        isSidebarOpen,
        setIsSidebarOpen,
        handleViewDetails,
        handleCloseSidebar
    };
};
