"use client";

import { useMemo } from "react";
import { ExternalService } from "@/shared/domain/resources";
import { useServicesQuery } from "./useServicesQuery";
import { useServicesFilter } from "./useServicesFilter";
import { useServicesView } from "./useServicesView";
import { ServicesBrowserFacade } from "../types/services-browser.types";

/**
 * useServicesBrowser: Facade hook that orchestrates data fetching, filtering, and UI state for services.
 * Refactored to adhere to SRP, DDD, and standard naming.
 */
export const useServicesBrowser = (initialServices: readonly ExternalService[] = []): ServicesBrowserFacade => {
    // 1. Data Fetching Logic
    const { services, isLoading, isError } = useServicesQuery(initialServices);
    
    // 2. Business Logic (Filtering and Sorting)
    const { processedServices, filterConfiguration } = useServicesFilter({ services });
    
    // 3. UI/View Management Logic
    const viewState = useServicesView();

    const selectedService = useMemo(() => 
        services.find((service) => service.id === viewState.selectedServiceId) || null,
    [services, viewState.selectedServiceId]);

    const recentlyUsedServices = useMemo(() => {
        return services.slice(0, 3);
    }, [services]);

    return {
        services,
        processedServices,
        recentlyUsedServices,
        selectedService,
        isLoading,
        isError,
        filterConfiguration,
        ...viewState
    };
};
