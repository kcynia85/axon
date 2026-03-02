import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "../infrastructure/api";

export const useLLMModels = () => {
    return useQuery({
        queryKey: ["llm-models"],
        queryFn: () => settingsApi.getLLMModels(),
    });
}

export const useLLMRouters = () => {
    return useQuery({
        queryKey: ["llm-routers"],
        queryFn: () => settingsApi.getLLMRouters(),
    });
}

export const useEmbeddingModels = () => {
    return useQuery({
        queryKey: ["embedding-models"],
        queryFn: () => settingsApi.getEmbeddingModels(),
    });
}

export const useChunkingStrategies = () => {
    return useQuery({
        queryKey: ["chunking-strategies"],
        queryFn: () => settingsApi.getChunkingStrategies(),
    });
}

export const useVectorDatabases = () => {
    return useQuery({
        queryKey: ["vector-databases"],
        queryFn: () => settingsApi.getVectorDatabases(),
    });
}
