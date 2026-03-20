import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client/config";
import { CostEstimateSchema, CostEstimate } from "@/shared/domain/workspaces";

export const useCostEstimate = (agentId: string | null): UseQueryResult<CostEstimate | null> => {
  return useQuery({
    queryKey: ["agent-cost-estimate", agentId],
    enabled: !!agentId,
    queryFn: async (): Promise<CostEstimate | null> => {
      if (!agentId) {
        return null;
      }
      const res = await apiClient.post(`/agents/${agentId}/cost-estimate`, {});
      const json = await res.json() as unknown;
      return CostEstimateSchema.parse(json);
    },
  });
};

