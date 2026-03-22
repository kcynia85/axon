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
        const res = await apiClient.get("/resources/archetypes");
        const data = await res.json() as unknown[];
        return data.map((a: unknown) => PromptArchetypeSchema.parse(a));
    },

    getPromptArchetype: async (id: string): Promise<PromptArchetype> => {
        const res = await apiClient.get(`/resources/archetypes/${id}`);
        const data = await res.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    createPromptArchetype: async (archetype: unknown): Promise<PromptArchetype> => {
        const res = await apiClient.post("/resources/archetypes", archetype);
        const data = await res.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    updatePromptArchetype: async (id: string, archetype: unknown): Promise<PromptArchetype> => {
        const res = await apiClient.put(`/resources/archetypes/${id}`, archetype);
        const data = await res.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    deletePromptArchetype: async (id: string): Promise<void> => {
        await apiClient.delete(`/resources/archetypes/${id}`);
    },

    // --- Internal Tools ---
    getInternalTools: async (): Promise<InternalTool[]> => {
        const res = await apiClient.get("/resources/internal-tools");
        const data = await res.json() as unknown[];
        return data.map((t: unknown) => InternalToolSchema.parse(t));
    },

    syncInternalTools: async (): Promise<{ added: number; updated: number; removed: number; errors: string[] }> => {
        const res = await apiClient.post("/resources/internal-tools/sync", {});
        return await res.json() as { added: number; updated: number; removed: number; errors: string[] };
    },

    // --- Knowledge Assets (Hubs) ---
    getAssets: async (): Promise<{ id: string; title: string }[]> => {
        // Mock implementation for now as the original module was removed
        return [
            { id: "hub-product", title: "Hub Product" },
            { id: "hub-marketing", title: "Hub Marketing" },
            { id: "hub-engineering", title: "Hub Engineering" },
            { id: "hub-general", title: "Hub General" }
        ];
    }
};
