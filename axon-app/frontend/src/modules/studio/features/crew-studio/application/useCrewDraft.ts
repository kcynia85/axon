"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type CrewStudioFormData } from "../types/crew-schema";

/**
 * useCrewDraft hook manages crew creation drafts using TanStack Query and localStorage.
 */
export const useCrewDraft = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["crew-draft", workspaceId];

  // Load draft from localStorage using useQuery
  const { data: draft, isLoading } = useQuery<Partial<CrewStudioFormData> | null>({
    queryKey,
    queryFn: () => {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(`axon_crew_draft_${workspaceId}`);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse crew draft", e);
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  // Save draft mutation
  const { mutate: saveDraft } = useMutation({
    mutationFn: async (data: Partial<CrewStudioFormData>) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(`axon_crew_draft_${workspaceId}`, JSON.stringify(data));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
  });

  // Clear draft mutation
  const { mutate: clearDraft } = useMutation({
    mutationFn: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(`axon_crew_draft_${workspaceId}`);
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
