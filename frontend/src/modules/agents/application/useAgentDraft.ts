"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAgentFormData } from "../domain/agent.schema";

/**
 * useAgentDraft hook manages agent creation drafts using TanStack Query.
 * Standard: Replaces useEffect with TanStack for data synchronization.
 */
export const useAgentDraft = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["agent-draft", workspaceId];

  // Load draft from localStorage using useQuery
  const { data: draft, isLoading } = useQuery<Partial<CreateAgentFormData> | null>({
    queryKey,
    queryFn: () => {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(`axon_agent_draft_${workspaceId}`);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse agent draft", e);
        return null;
      }
    },
    staleTime: Infinity, // Keep in cache indefinitely
    gcTime: 1000 * 60 * 60, // Keep in garbage collection for 1 hour
  });

  // Save draft mutation
  const { mutate: saveDraft } = useMutation({
    mutationFn: async (data: Partial<CreateAgentFormData>) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(`axon_agent_draft_${workspaceId}`, JSON.stringify(data));
      }
      return data;
    },
    onSuccess: (data) => {
      // Update cache immediately to reflect the new draft state
      queryClient.setQueryData(queryKey, data);
    },
  });

  // Clear draft mutation
  const { mutate: clearDraft } = useMutation({
    mutationFn: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(`axon_agent_draft_${workspaceId}`);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKey, null);
    },
  });

  return {
    draft,
    isLoading,
    saveDraft,
    clearDraft
  };
};
