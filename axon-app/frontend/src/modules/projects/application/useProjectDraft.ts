"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProjectFormData } from "./schemas";

export const useProjectDraft = (workspaceId: string, projectId?: string) => {
  const queryClient = useQueryClient();
  const idKey = projectId || "new";
  const queryKey = ["project-draft", workspaceId, idKey];
  const storageKey = `axon_project_draft_${workspaceId}_${idKey}`;

  const { data: draft, isLoading } = useQuery<Partial<CreateProjectFormData> | null>({
    queryKey,
    queryFn: () => {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(storageKey);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse project draft", e);
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    notifyOnChangeProps: ['isLoading', 'isError'],
  });

  const { mutate: saveDraft } = useMutation({
    mutationFn: async (data: Partial<CreateProjectFormData>) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
  });

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
