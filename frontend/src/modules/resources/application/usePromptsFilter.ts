import { useMemo } from "react";
import { PromptArchetype } from "@/shared/domain/resources";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { PromptsFilterResult, UsePromptsFilterProps } from "../types/prompts-browser.types";

/**
 * usePromptsFilter: Pure business logic for filtering and sorting prompt archetypes.
 */
export const usePromptsFilter = ({ prompts }: UsePromptsFilterProps): PromptsFilterResult => {
    const filterItems = (items: readonly PromptArchetype[], query: string, filterIds: string[]) => {
        return items.filter((prompt) => {
            const archetypeName = (prompt.archetype_name || "").toLowerCase();
            const matchesSearchQuery = archetypeName.includes(query.toLowerCase());
            
            if (!matchesSearchQuery) return false;
            if (filterIds.length === 0) return true;

            const domain = (prompt.workspace_domain || "").toLowerCase();
            const domainFilters = filterIds.filter((id) => ["product", "marketing", "engineering", "legal"].includes(id.toLowerCase()));
            
            if (domainFilters.length > 0 && !domainFilters.some((domainFilter) => domain.includes(domainFilter))) {
                return false;
            }

            return true;
        });
    };

    const filterConfiguration = useResourceFilters<PromptArchetype>({
        filterItems,
        initialFilterGroups: [
            {
                id: "domain",
                title: "Domain:",
                type: "checkbox",
                options: [
                    { id: "product", label: "Product", isChecked: false },
                    { id: "marketing", label: "Marketing", isChecked: false },
                    { id: "engineering", label: "Engineering", isChecked: false },
                    { id: "legal", label: "Legal", isChecked: false },
                ]
            }
        ]
    });

    const processedPrompts = useMemo(() => {
        return [...filterConfiguration.getFilteredItems(prompts)]
            .sort((firstPrompt, secondPrompt) => {
                const nameFirst = (firstPrompt.archetype_name || "").toLowerCase();
                const nameSecond = (secondPrompt.archetype_name || "").toLowerCase();
                const dateFirst = new Date(firstPrompt.created_at || 0).getTime();
                const dateSecond = new Date(secondPrompt.created_at || 0).getTime();

                switch (filterConfiguration.sortBy) {
                    case "name-asc": return nameFirst.localeCompare(nameSecond);
                    case "name-desc": return nameSecond.localeCompare(nameFirst);
                    case "date-asc": return dateFirst - dateSecond;
                    case "date-desc": return dateSecond - dateFirst;
                    default: return 0;
                }
            });
    }, [prompts, filterConfiguration]);

    return {
        processedPrompts,
        filterConfiguration
    };
};
