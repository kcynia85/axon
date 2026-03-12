import { ExternalService } from "@/shared/domain/resources";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";

export type ServicesViewMode = "grid" | "list";

export type ServicesBrowserViewState = {
    readonly viewMode: ServicesViewMode;
    readonly setViewMode: (mode: ServicesViewMode) => void;
    readonly selectedServiceId: string | null;
    readonly isSidebarOpen: boolean;
    readonly setIsSidebarOpen: (isOpen: boolean) => void;
    readonly handleViewDetails: (serviceId: string) => void;
    readonly handleCloseSidebar: () => void;
};

export type ServicesFilterResult = {
    readonly processedServices: readonly ExternalService[];
    readonly filterConfiguration: ReturnType<typeof useResourceFilters<ExternalService>>;
};

export type UseServicesFilterProps = {
    readonly services: readonly ExternalService[];
};

export type ServicesBrowserFacade = {
    readonly services: readonly ExternalService[];
    readonly processedServices: readonly ExternalService[];
    readonly recentlyUsedServices: readonly ExternalService[];
    readonly selectedService: ExternalService | null;
    readonly isLoading: boolean;
    readonly isError: boolean;
    readonly filterConfiguration: ReturnType<typeof useResourceFilters<ExternalService>>;
} & ServicesBrowserViewState;
