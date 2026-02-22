import { apiClient } from "@/shared/lib/api-client/config";
import {
    PromptArchetype,
    ExternalService,
    InternalTool,
    Automation,
    PromptArchetypeSchema,
    ExternalServiceSchema,
    InternalToolSchema,
    AutomationSchema
} from "@/shared/domain/resources";

export const resourcesApi = {
    // --- Prompt Archetypes ---
    getPromptArchetypes: async (): Promise<PromptArchetype[]> => {
        const res = await apiClient.get("/resources/prompts");
        const data = await res.json() as unknown[];
        return data.map((a: unknown) => PromptArchetypeSchema.parse(a));
    },

    createPromptArchetype: async (archetype: unknown): Promise<PromptArchetype> => {
        const res = await apiClient.post("/resources/prompts", archetype);
        const data = await res.json() as unknown;
        return PromptArchetypeSchema.parse(data);
    },

    // --- External Services ---
    getExternalServices: async (): Promise<ExternalService[]> => {
        const res = await apiClient.get("/resources/services");
        const data = await res.json() as unknown[];
        return data.map((s: unknown) => ExternalServiceSchema.parse(s));
    },

    createExternalService: async (service: unknown): Promise<ExternalService> => {
        const res = await apiClient.post("/resources/services", service);
        const data = await res.json() as unknown;
        return ExternalServiceSchema.parse(data);
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
    },

    // --- Automations ---
    getAutomations: async (): Promise<Automation[]> => {
        const res = await apiClient.get("/resources/automations");
        const data = await res.json() as unknown[];
        return data.map((a: unknown) => AutomationSchema.parse(a));
    },

    createAutomation: async (automation: unknown): Promise<Automation> => {
        const res = await apiClient.post("/resources/automations", automation);
        const data = await res.json() as unknown;
        return AutomationSchema.parse(data);
    },

    testAutomation: async (id: string, payload: unknown): Promise<unknown> => {
        const res = await apiClient.post(`/resources/automations/${id}/test`, payload);
        return await res.json() as unknown;
    }
};
