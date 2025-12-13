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
