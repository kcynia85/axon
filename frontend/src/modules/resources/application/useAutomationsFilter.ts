import { useMemo } from "react";
import { Automation } from "@/shared/domain/workspaces";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { AutomationFilterResult, UseAutomationsFilterProps } from "../types/automation-browser.types";

/**
 * useAutomationsFilter: Domain logic for filtering resources.
 * Standard: No types declared in this file. All types imported from ../types/
 */
export const useAutomationsFilter = ({ automations }: UseAutomationsFilterProps): AutomationFilterResult => {
    const filterItems = (items: readonly Automation[], query: string, filterIds: string[]) => {
        return items.filter((automation) => {
            const automationName = (automation.automation_name || "").toLowerCase();
            const matchesSearchQuery = automationName.includes(query.toLowerCase());
            
            if (!matchesSearchQuery) return false;
            if (filterIds.length === 0) return true;

            const platform = (automation.automation_platform || "").toLowerCase();
            const platformFilters = filterIds.filter((id) => ["n8n", "zapier", "make", "custom"].includes(id));
            
            if (platformFilters.length > 0 && !platformFilters.includes(platform)) {
                return false;
            }

            return true;
        });
    };

    const filterConfiguration = useResourceFilters<Automation>({
        filterItems,
        initialFilterGroups: [
            {
                id: "platform",
                title: "Platform:",
                type: "checkbox",
                options: [
                    { id: "n8n", label: "n8n", isChecked: false },
                    { id: "zapier", label: "Zapier", isChecked: false },
                    { id: "make", label: "Make", isChecked: false },
                    { id: "custom", label: "Custom", isChecked: false },
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

    const processedAutomations = useMemo(() => {
        return [...filterConfiguration.getFilteredItems(automations)]
            .sort((firstAutomation, secondAutomation) => {
                const nameFirst = (firstAutomation.automation_name || "").toLowerCase();
                const nameSecond = (secondAutomation.automation_name || "").toLowerCase();
                const dateFirst = new Date(firstAutomation.created_at || 0).getTime();
                const dateSecond = new Date(secondAutomation.created_at || 0).getTime();

                switch (filterConfiguration.sortBy) {
                    case "name-asc": return nameFirst.localeCompare(nameSecond);
                    case "name-desc": return nameSecond.localeCompare(nameFirst);
                    case "date-asc": return dateFirst - dateSecond;
                    case "date-desc": return dateSecond - dateFirst;
                    default: return 0;
                }
            });
    }, [automations, filterConfiguration]);

    return {
        processedAutomations,
        filterConfiguration
    };
};
