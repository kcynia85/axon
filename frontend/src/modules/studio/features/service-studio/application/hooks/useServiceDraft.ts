"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ServiceStudioFormData } from "../../types/service-schema";

/**
 * useServiceDraft hook manages service creation drafts using TanStack Query and localStorage.
 * Standard: 0% useEffect, consistent with Agent, Crew and Template modules.
 */
export const useServiceDraft = (workspaceId: string, serviceId?: string | null) => {
  const queryClient = useQueryClient();
  const draftSuffix = serviceId || "new";
  const queryKey = ["service-draft", workspaceId, draftSuffix];
  const storageKey = `axon_service_draft_${workspaceId}_${draftSuffix}`;

  // Load draft from localStorage using useQuery
  const { data: draft, isLoading } = useQuery<Partial<ServiceStudioFormData> | null>({
    queryKey,
    queryFn: () => {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(storageKey);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse service draft", e);
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  // Save draft mutation
  const { mutate: saveDraft } = useMutation({
    mutationFn: async (data: Partial<ServiceStudioFormData>) => {
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
