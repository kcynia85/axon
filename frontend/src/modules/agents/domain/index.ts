export interface Agent {
    id: string;
    role: string;
    name: string;
}

export interface ChatSession {
    id: string;
    agentId: string;
    messages: any[]; // Define Message type properly
}
