import { useMemo } from "react";
import { ExternalService } from "@/shared/domain/resources";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { ServicesFilterResult, UseServicesFilterProps } from "../types/services-browser.types";

/**
 * useServicesFilter: Pure business logic for filtering and sorting services.
 * Standard: 0% useEffect, types imported from types/
 */
export const useServicesFilter = ({ services }: UseServicesFilterProps): ServicesFilterResult => {
    const filterItems = (items: readonly ExternalService[], query: string, filterIds: string[]) => {
        return items.filter((service) => {
            const serviceName = (service.service_name || "").toLowerCase();
            const matchesSearchQuery = serviceName.includes(query.toLowerCase());
            
            if (!matchesSearchQuery) return false;
            if (filterIds.length === 0) return true;

            const category = (service.service_category || "").toLowerCase();
            const categoryFilters = filterIds.filter((id) => ["utility", "genai", "scraping", "business"].includes(id));
            
            if (categoryFilters.length > 0 && !categoryFilters.includes(category)) {
                return false;
            }

            return true;
        });
    };

    const filterConfiguration = useResourceFilters<ExternalService>({
        filterItems,
        initialFilterGroups: [
            {
                id: "category",
                title: "Category:",
                type: "checkbox",
                options: [
                    { id: "genai", label: "GenAI", isChecked: false },
                    { id: "scraping", label: "Scraping", isChecked: false },
                    { id: "utility", label: "Utility", isChecked: false },
                    { id: "business", label: "Business", isChecked: false },
                ]
            },
            {
                id: "workspaces",
                title: "Workspaces:",
                type: "checkbox",
                options: [
                    { id: "global", label: "Global", isChecked: false },
                    { id: "product-mgmt", label: "Product Management", isChecked: false },
                ]
            }
        ]
    });

    const processedServices = useMemo(() => {
        return [...filterConfiguration.getFilteredItems(services)]
            .sort((firstService, secondService) => {
                const nameFirst = (firstService.service_name || "").toLowerCase();
                const nameSecond = (secondService.service_name || "").toLowerCase();
                const dateFirst = new Date(firstService.created_at || 0).getTime();
                const dateSecond = new Date(secondService.created_at || 0).getTime();

                switch (filterConfiguration.sortBy) {
                    case "name-asc": return nameFirst.localeCompare(nameSecond);
                    case "name-desc": return nameSecond.localeCompare(nameFirst);
                    case "date-asc": return dateFirst - dateSecond;
                    case "date-desc": return dateSecond - dateFirst;
                    default: return 0;
                }
            });
    }, [services, filterConfiguration]);

    return {
        processedServices,
        filterConfiguration
    };
};
