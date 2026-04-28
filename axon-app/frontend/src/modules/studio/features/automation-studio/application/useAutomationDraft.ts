"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type AutomationFormData } from "../types/automation-schema";

/**
 * useAutomationDraft hook manages automation creation drafts using TanStack Query and localStorage.
 * Standard: 0% useEffect, consistent with Agent, Crew and Template modules.
 */
export const useAutomationDraft = (workspaceId: string, automationId?: string | null) => {
  const queryClient = useQueryClient();
  const draftSuffix = automationId || "new";
  const queryKey = ["automation-draft", workspaceId, draftSuffix];
  const storageKey = `axon_automation_draft_${workspaceId}_${draftSuffix}`;

  // Load draft from localStorage using useQuery
  const { data: draft, isLoading } = useQuery<Partial<AutomationFormData> | null>({
    queryKey,
    queryFn: () => {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(storageKey);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse automation draft", error);
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  // Save draft mutation
  const { mutate: saveDraft } = useMutation({
    mutationFn: async (data: Partial<AutomationFormData>) => {
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
