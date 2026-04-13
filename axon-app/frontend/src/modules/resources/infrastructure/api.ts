import { apiClient } from "@/shared/lib/api-client/config";
import {
    PromptArchetype,
    InternalTool,
    PromptArchetypeSchema,
    InternalToolSchema
} from "@/shared/domain/resources";

export const resourcesApi = {
    // --- Prompt Archetypes ---
    getPromptArchetypes: async (): Promise<PromptArchetype[]> => {
        const response = await apiClient.get("/resources/archetypes");
        const data = await response.json() as unknown[];
        return data.map((archetype: unknown) => PromptArchetypeSchema.parse(archetype));
    },

    getPromptArchetype: async (id: string): Promise<PromptArchetype> => {
        const response = await apiClient.get(`/resources/archetypes/${id}`);
        const data = await response.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    createPromptArchetype: async (archetype: unknown): Promise<PromptArchetype> => {
        const response = await apiClient.post("/resources/archetypes", archetype);
        const data = await response.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    updatePromptArchetype: async (id: string, archetype: unknown): Promise<PromptArchetype> => {
        const response = await apiClient.put(`/resources/archetypes/${id}`, archetype);
        const data = await response.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    deletePromptArchetype: async (id: string): Promise<void> => {
        await apiClient.delete(`/resources/archetypes/${id}`);
    },

    // --- Internal Tools ---
    getInternalTools: async (): Promise<InternalTool[]> => {
        const response = await apiClient.get("/resources/internal-tools");
        const data = await response.json() as unknown[];
        return data.map((tool: unknown) => InternalToolSchema.parse(tool));
    },

    syncInternalTools: async (): Promise<{ added: number; updated: number; removed: number; errors: string[] }> => {
        const response = await apiClient.post("/resources/internal-tools/sync", {});
        return await response.json() as { added: number; updated: number; removed: number; errors: string[] };
    },

    // --- Knowledge Hubs & Resources ---
    getKnowledgeHubs: async (): Promise<any[]> => {
        const response = await apiClient.get("/knowledge/hubs");
        return await response.json() as any[];
    },

    getKnowledgeResources: async (): Promise<any[]> => {
        const response = await apiClient.get("/knowledge/resources");
        return await response.json() as any[];
    },

    getKnowledgeResource: async (id: string): Promise<any> => {
        const response = await apiClient.get(`/knowledge/resources/${id}`);
        return await response.json() as any;
    },

    getKnowledgeResourceChunks: async (id: string): Promise<any[]> => {
        const response = await apiClient.get(`/knowledge/resources/${id}/chunks`);
        return await response.json() as any[];
    },

    updateKnowledgeResource: async (id: string, data: any): Promise<any> => {
        const response = await apiClient.put(`/knowledge/resources/${id}`, data);
        return await response.json() as any;
    },

    deleteKnowledgeResource: async (id: string): Promise<void> => {
        await apiClient.delete(`/knowledge/resources/${id}`);
    },

    uploadKnowledgeResource: async (formData: FormData): Promise<any> => {
        const response = await apiClient.postFormData("/knowledge/resources", formData);
        return await response.json() as any;
    },

    getKnowledgeResourcePreview: async (formData: FormData): Promise<{ chunks: any[], chunk_count: number }> => {
        const response = await apiClient.postFormData("/knowledge/resources/preview", formData);
        return await response.json() as any;
    },


    // --- Knowledge Assets ---
    getAssets: async (): Promise<{ id: string; title: string }[]> => {
        try {
            const response = await apiClient.get("/knowledge/hubs");
            const hubs = await response.json() as any[];
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
