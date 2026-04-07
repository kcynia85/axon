"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type TemplateStudioFormData } from "../../types/template-studio.types";

/**
 * useTemplateDraft hook manages template creation drafts using TanStack Query and localStorage.
 * Standard: 0% useEffect, consistent with Agent and Crew modules.
 */
export const useTemplateDraft = (workspaceId: string, templateId?: string | null) => {
  const queryClient = useQueryClient();
  const draftSuffix = templateId || "new";
  const queryKey = ["template-draft", workspaceId, draftSuffix];
  const storageKey = `axon_template_draft_${workspaceId}_${draftSuffix}`;

  // Load draft from localStorage using useQuery
  const { data: draft, isLoading } = useQuery<Partial<TemplateStudioFormData> | null>({
    queryKey,
    queryFn: () => {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(storageKey);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse template draft", error);
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  // Save draft mutation
  const { mutate: saveDraft } = useMutation({
    mutationFn: async (data: Partial<TemplateStudioFormData>) => {
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
