import { useQuery } from "@tanstack/react-query";
import { resourcesApi } from "../infrastructure/api";

export const useKnowledgeResourcesQuery = () => {
    return useQuery({
        queryKey: ["knowledge-resources"],
        queryFn: () => resourcesApi.getKnowledgeResources(),
    });
};
