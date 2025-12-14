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
    role: AgentRole;
    description: string;
    tools: string[];
    model: string;
}