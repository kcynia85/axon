import { API_BASE_URL, endpoints } from "@/lib/api-client/config";
import { AgentRole } from "../../../domain/types";

export interface ChatStreamPayload {
    project_id: string;
    agent_role: AgentRole;
    message: string;
}

/**
 * Initiates a streaming chat session with an agent.
 * Returns the raw Response object which needs to be handled by the caller (SSE parsing).
 */
export const streamChat = async (payload: ChatStreamPayload): Promise<Response> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.agents.chatStream}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
        throw new Error("Failed to initiate agent session stream");
    }

    return response;
};
