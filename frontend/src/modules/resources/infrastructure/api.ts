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
        const data = await res.json();
        return data.map((a: any) => PromptArchetypeSchema.parse(a));
    },

    createPromptArchetype: async (archetype: any): Promise<PromptArchetype> => {
        const res = await apiClient.post("/resources/prompts", archetype);
        const data = await res.json();
        return PromptArchetypeSchema.parse(data);
    },

    // --- External Services ---
    getExternalServices: async (): Promise<ExternalService[]> => {
        const res = await apiClient.get("/resources/services");
        const data = await res.json();
        return data.map((s: any) => ExternalServiceSchema.parse(s));
    },

    createExternalService: async (service: any): Promise<ExternalService> => {
        const res = await apiClient.post("/resources/services", service);
        const data = await res.json();
        return ExternalServiceSchema.parse(data);
    },

    // --- Internal Tools ---
    getInternalTools: async (): Promise<InternalTool[]> => {
        const res = await apiClient.get("/resources/tools");
        const data = await res.json();
        return data.map((t: any) => InternalToolSchema.parse(t));
    },

    syncTools: async (): Promise<any> => {
        const res = await apiClient.post("/resources/tools/sync", {});
        return await res.json();
    },

    // --- Automations ---
    getAutomations: async (): Promise<Automation[]> => {
        const res = await apiClient.get("/resources/automations");
        const data = await res.json();
        return data.map((a: any) => AutomationSchema.parse(a));
    },

    createAutomation: async (automation: any): Promise<Automation> => {
        const res = await apiClient.post("/resources/automations", automation);
        const data = await res.json();
        return AutomationSchema.parse(data);
    },

    testAutomation: async (id: string, payload: any): Promise<any> => {
        const res = await apiClient.post(`/resources/automations/${id}/test`, payload);
        return await res.json();
    }
};
