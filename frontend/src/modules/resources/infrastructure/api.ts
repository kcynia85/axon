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
        const res = await apiClient.get("/resources/prompts");
        const data = await res.json() as unknown[];
        return data.map((a: unknown) => PromptArchetypeSchema.parse(a));
    },

    getPromptArchetype: async (id: string): Promise<PromptArchetype> => {
        const res = await apiClient.get(`/resources/prompts/${id}`);
        const data = await res.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    createPromptArchetype: async (archetype: unknown): Promise<PromptArchetype> => {
        const res = await apiClient.post("/resources/prompts", archetype);
        const data = await res.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    updatePromptArchetype: async (id: string, archetype: unknown): Promise<PromptArchetype> => {
        const res = await apiClient.put(`/resources/prompts/${id}`, archetype);
        const data = await res.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    deletePromptArchetype: async (id: string): Promise<void> => {
        await apiClient.delete(`/resources/prompts/${id}`);
    },

    // --- Internal Tools ---
    getInternalTools: async (): Promise<InternalTool[]> => {
        const res = await apiClient.get("/resources/tools");
        const data = await res.json() as unknown[];
        return data.map((t: unknown) => InternalToolSchema.parse(t));
    },

    syncTools: async (): Promise<unknown> => {
        const res = await apiClient.post("/resources/tools/sync", {});
        return await res.json() as unknown;
    }
};
