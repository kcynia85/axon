import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client/config";
import { InternalTool } from "@/shared/domain/resources";

export const useInternalTools = () => {
    return useQuery({
        queryKey: ["internal-tools"],
        queryFn: async () => {
            const response = await apiClient.get("/resources/tools/internal");
            return response.json() as Promise<InternalTool[]>;
        },
    });
};
