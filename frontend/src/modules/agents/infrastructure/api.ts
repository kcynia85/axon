import { AgentConfig } from "../domain";
import { isMockMode } from "@/shared/infrastructure/mock-adapter";
import { getAgentsMock } from "./mock-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getAgents = async (): Promise<AgentConfig[]> => {
    if (isMockMode()) {
        return getAgentsMock();
    }
    const res = await fetch(`${API_URL}/agents/configs`);
    if (!res.ok) throw new Error("Failed to fetch agents");
    return res.json();
};

export const updateAgentConfig = async (config: AgentConfig): Promise<AgentConfig> => {
     if (isMockMode()) {
        console.log("Mock update agent config", config);
        return config;
    }
    const res = await fetch(`${API_URL}/agents/configs/${config.role}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error("Failed to update agent config");
    return res.json();
}
