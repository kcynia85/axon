import { apiClient } from "@/shared/lib/api-client/config";
import {
    PromptArchetype,
    InternalTool,
    KnowledgeHub,
    KnowledgeResource,
    TextChunk,
} from "@/shared/domain/resources";

export const resourcesApi = {
    // --- Prompt Archetypes ---
    getPromptArchetypes: async (): Promise<PromptArchetype[]> => {
        const response = await apiClient.get("/resources/archetypes");
        return await response.json() as PromptArchetype[];
    },

    getPromptArchetype: async (id: string): Promise<PromptArchetype> => {
        const response = await apiClient.get(`/resources/archetypes/${id}`);
        return await response.json() as PromptArchetype;
    },

    createPromptArchetype: async (archetype: unknown): Promise<PromptArchetype> => {
        const response = await apiClient.post("/resources/archetypes", archetype);
        return await response.json() as PromptArchetype;
    },

    updatePromptArchetype: async (id: string, archetype: unknown): Promise<PromptArchetype> => {
        const response = await apiClient.put(`/resources/archetypes/${id}`, archetype);
        return await response.json() as PromptArchetype;
    },

    deletePromptArchetype: async (id: string): Promise<void> => {
        await apiClient.delete(`/resources/archetypes/${id}`);
    },

    // --- Internal Tools ---
    getInternalTools: async (): Promise<InternalTool[]> => {
        const response = await apiClient.get("/resources/internal-tools");
        return await response.json() as InternalTool[];
    },

    syncInternalTools: async (): Promise<{ added: number; updated: number; removed: number; errors: string[] }> => {
        const response = await apiClient.post("/resources/internal-tools/sync", {});
        return await response.json() as { added: number; updated: number; removed: number; errors: string[] };
    },

    // --- Knowledge Hubs & Resources ---
    getKnowledgeHubs: async (): Promise<KnowledgeHub[]> => {
        const response = await apiClient.get("/knowledge/hubs");
        return await response.json() as KnowledgeHub[];
    },

    getKnowledgeResources: async (): Promise<KnowledgeResource[]> => {
        const response = await apiClient.get("/knowledge/resources");
        return await response.json() as KnowledgeResource[];
    },

    getKnowledgeResource: async (id: string): Promise<KnowledgeResource> => {
        const response = await apiClient.get(`/knowledge/resources/${id}`);
        return await response.json() as KnowledgeResource;
    },

    getKnowledgeResourceChunks: async (id: string): Promise<TextChunk[]> => {
        const response = await apiClient.get(`/knowledge/resources/${id}/chunks`);
        return await response.json() as TextChunk[];
    },

    updateKnowledgeResource: async (id: string, data: Partial<KnowledgeResource>): Promise<KnowledgeResource> => {
        const response = await apiClient.put(`/knowledge/resources/${id}`, data);
        return await response.json() as KnowledgeResource;
    },

    deleteKnowledgeResource: async (id: string): Promise<void> => {
        await apiClient.delete(`/knowledge/resources/${id}`);
    },

    uploadKnowledgeResource: async (formData: FormData): Promise<KnowledgeResource> => {
        const response = await apiClient.postFormData("/knowledge/resources", formData);
        return await response.json() as KnowledgeResource;
    },

    getKnowledgeResourcePreview: async (formData: FormData): Promise<{ chunks: string[], chunk_count: number }> => {
        const response = await apiClient.postFormData("/knowledge/resources/preview", formData);
        return await response.json() as { chunks: string[], chunk_count: number };
    },


    // --- Knowledge Assets ---
    getAssets: async (): Promise<{ id: string; title: string }[]> => {
        try {
            const response = await apiClient.get("/knowledge/hubs");
            const hubs = await response.json() as KnowledgeHub[];
            return hubs.map(hub => ({
                id: hub.id,
                title: hub.hub_name
            }));
        } catch (error) {
            console.error("Failed to fetch knowledge hubs", error);
            return [];
        }
    }
};
