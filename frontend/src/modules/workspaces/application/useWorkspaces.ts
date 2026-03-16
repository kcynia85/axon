import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { Workspace } from "@/shared/domain/workspaces";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  infinite: () => [...workspaceKeys.all, "infinite"] as const,
  detail: (id: string) => [...workspaceKeys.all, "detail", id] as const,
  agents: (workspaceId: string) => [...workspaceKeys.detail(workspaceId), "agents"] as const,
  crews: (workspaceId: string) => [...workspaceKeys.detail(workspaceId), "crews"] as const,
  patterns: (workspaceId: string) => [...workspaceKeys.detail(workspaceId), "patterns"] as const,
  templates: (workspaceId: string) => [...workspaceKeys.detail(workspaceId), "templates"] as const,
  services: (workspaceId: string) => [...workspaceKeys.detail(workspaceId), "services"] as const,
  automations: (workspaceId: string) => [...workspaceKeys.detail(workspaceId), "automations"] as const,
};

/**
 * useWorkspaces: Hook for fetching all available workspaces.
 * Standard: 0% useEffect, arrow function.
 */
export const useWorkspaces = (limit: number = 100) => {
  return useQuery<Workspace[]>({
    queryKey: workspaceKeys.lists(),
    queryFn: async () => await workspacesApi.getWorkspaces(limit),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * useWorkspace: Hook for fetching a single workspace by ID.
 */
export const useWorkspace = (id: string) => {
  return useQuery<Workspace>({
    queryKey: workspaceKeys.detail(id),
    queryFn: async () => await workspacesApi.getWorkspace(id),
    enabled: !!id,
  });
};

/**
 * useAgents: Hook for fetching agents in a workspace.
 */
export const useAgents = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.agents(workspaceId),
    queryFn: async () => await workspacesApi.getAgents(workspaceId),
    enabled: !!workspaceId,
  });
};

/**
 * useCrews: Hook for fetching crews in a workspace.
 */
export const useCrews = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.crews(workspaceId),
    queryFn: async () => await workspacesApi.getCrews(workspaceId),
    enabled: !!workspaceId,
  });
};

/**
 * usePatterns: Hook for fetching patterns in a workspace.
 */
export const usePatterns = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.patterns(workspaceId),
    queryFn: async () => await workspacesApi.getPatterns(workspaceId),
    enabled: !!workspaceId,
  });
};

/**
 * useTemplates: Hook for fetching templates in a workspace.
 */
export const useTemplates = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.templates(workspaceId),
    queryFn: async () => await workspacesApi.getTemplates(workspaceId),
    enabled: !!workspaceId,
  });
};

/**
 * useServices: Hook for fetching services (mapped to global resources).
 */
export const useServices = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.services(workspaceId),
    queryFn: async () => await resourcesApi.getExternalServices(),
    enabled: !!workspaceId,
  });
};

/**
 * useAutomations: Hook for fetching automations in a workspace.
 */
export const useAutomations = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.automations(workspaceId),
    queryFn: async () => await workspacesApi.getAutomations(workspaceId),
    enabled: !!workspaceId,
  });
};
