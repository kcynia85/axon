import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client/config";
import { CostEstimateSchema } from "@/shared/domain/workspaces";

export function useCostEstimate(agentId: string | null) {
  return useQuery({
    queryKey: ["agent-cost-estimate", agentId],
    enabled: !!agentId,
    queryFn: async () => {
      if (!agentId) {
        return null;
      }
      const res = await apiClient.post(`/agents/${agentId}/cost-estimate`, {});
      const json = await res.json();
      return CostEstimateSchema.parse(json);
    },
  });
}

