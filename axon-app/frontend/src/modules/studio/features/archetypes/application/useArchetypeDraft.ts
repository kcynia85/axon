"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ArchetypeFormValues } from "../application/archetypeSchema";

/**
 * useArchetypeDraft hook manages archetype creation drafts using TanStack Query and localStorage.
 * Standard: 0% useEffect, consistent with Agent, Crew and Template modules.
 */
export const useArchetypeDraft = (workspaceId: string, archetypeId?: string | null) => {
  const queryClient = useQueryClient();
  const draftSuffix = archetypeId || "new";
  const queryKey = ["archetype-draft", workspaceId, draftSuffix];
  const storageKey = `axon_archetype_draft_${workspaceId}_${draftSuffix}`;

  // Load draft from localStorage using useQuery
  const { data: draft, isLoading } = useQuery<Partial<ArchetypeFormValues> | null>({
    queryKey,
    queryFn: () => {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(storageKey);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse archetype draft", e);
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    notifyOnChangeProps: ["isLoading", "isError"], // Critical: prevent form resets when cache updates
  });

  // Save draft mutation
  const { mutate: saveDraft } = useMutation({
    mutationFn: async (data: Partial<ArchetypeFormValues>) => {
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
    clearDraft
  };
};
