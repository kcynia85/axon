export enum AgentRole {
    MANAGER = "MANAGER",
    RESEARCHER = "RESEARCHER",
    BUILDER = "BUILDER",
    WRITER = "WRITER"
}

export interface Message {
    role: "user" | "model" | "system";
    content: string;
    timestamp?: string;
}

export interface ChatSession {
    id: string;
    messages: Message[];
    agentRole: AgentRole;
}

export interface AgentConfig {
    id: string;
    role: AgentRole;
    description: string;
    model_tier: string;
    tools: string[];
    system_instruction: string;
    created_at?: string;
    updated_at?: string;
}