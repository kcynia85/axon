import { useQuery } from "@tanstack/react-query";
import { InternalTool } from "@/shared/domain/resources";
import { resourcesApi } from "../infrastructure/api";

export const useInternalTools = () => {
    return useQuery({
        queryKey: ["internal-tools"],
        queryFn: async (): Promise<InternalTool[]> => {
            return resourcesApi.getInternalTools();
        },
    });
};
