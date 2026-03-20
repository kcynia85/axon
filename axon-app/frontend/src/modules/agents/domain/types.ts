export enum AgentRole {
    MANAGER = "MANAGER",
    RESEARCHER = "RESEARCHER",
    BUILDER = "BUILDER",
    WRITER = "WRITER"
}

export type Message = {
    readonly role: "user" | "model" | "system";
    readonly content: string;
    readonly timestamp?: string;
}

export type ChatSession = {
    readonly id: string;
    readonly messages: readonly Message[];
    readonly agentRole: AgentRole;
}

export type AgentConfig = {
    readonly id: string;
    readonly role: AgentRole;
    readonly description: string;
    readonly model_tier: string;
    readonly tools: readonly string[];
    readonly system_instruction: string;
    readonly created_at?: string;
    readonly updated_at?: string;
}
