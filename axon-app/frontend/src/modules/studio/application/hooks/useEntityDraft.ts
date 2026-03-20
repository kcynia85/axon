"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * useEntityDraft is a generic hook to manage draft data for any entity type.
 * It uses TanStack Query for state management and localStorage for persistence.
 */
export const useEntityDraft = <T>(
  entityType: "service" | "automation" | "archetype",
  workspaceId: string,
  entityId?: string | null
) => {
  const queryClient = useQueryClient();
  const draftSuffix = entityId || "new";
  const queryKey = ["draft", entityType, workspaceId, draftSuffix];
  const storageKey = `axon_${entityType}_draft_${workspaceId}_${draftSuffix}`;

  // Load draft from localStorage
  const { data: draft, isLoading } = useQuery<Partial<T> | null>({
    queryKey,
    queryFn: () => {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(storageKey);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(`Failed to parse ${entityType} draft`, e);
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  // Save draft mutation
  const { mutate: saveDraft } = useMutation({
    mutationFn: async (data: Partial<T>) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(data));
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
        localStorage.removeItem(storageKey);
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
    clearDraft,
  };
};
