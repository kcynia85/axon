import { useExternalServices } from "./useExternalServices";
import { ExternalService } from "@/shared/domain/resources";

/**
 * useServicesQuery: Encapsulates data fetching for external services.
 */
export const useServicesQuery = (initialServices: readonly ExternalService[] = []) => {
    const { data: services = initialServices, isLoading, isError } = useExternalServices();

    return {
        services,
        isLoading,
        isError
    };
};
