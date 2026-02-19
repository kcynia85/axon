import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "../infrastructure/api";

export function useLLMModels() {
    return useQuery({
        queryKey: ["llm-models"],
        queryFn: () => settingsApi.getLLMModels(),
    });
}

export function useLLMRouters() {
    return useQuery({
        queryKey: ["llm-routers"],
        queryFn: () => settingsApi.getLLMRouters(),
    });
}

export function useEmbeddingModels() {
    return useQuery({
        queryKey: ["embedding-models"],
        queryFn: () => settingsApi.getEmbeddingModels(),
    });
}

export function useChunkingStrategies() {
    return useQuery({
        queryKey: ["chunking-strategies"],
        queryFn: () => settingsApi.getChunkingStrategies(),
    });
}

export function useVectorDatabases() {
    return useQuery({
        queryKey: ["vector-databases"],
        queryFn: () => settingsApi.getVectorDatabases(),
    });
}
