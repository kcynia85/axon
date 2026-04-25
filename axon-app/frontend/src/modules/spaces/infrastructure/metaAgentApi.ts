import { authenticatedClient } from "@/shared/lib/api-client/authenticated-client";

export interface MetaAgentAttachment {
    name: string;
    content_type: string;
    content_base64?: string;
    size_bytes: number;
}

export interface MetaAgentProposalRequest {
    space_id: string;
    query: string;
    context?: Record<string, any>;
    attachments?: MetaAgentAttachment[];
}

export interface MetaAgentDraftEntity {
    entity: "agent" | "crew" | "knowledge" | "unknown";
    status: "draft";
    name: string;
    description: string;
    visual_url?: string;
    payload: Record<string, any>;
}

export interface MetaAgentProposalConnection {
    source_draft_name: string;
    target_draft_name: string;
}

export interface MetaAgentContextStats {
    space_canvas_tokens: number;
    system_awareness_tokens: number;
    knowledge_tokens: number;
    project_context_tokens: number;
    notion_tokens: number;
    attachments_tokens: number;
    total_tokens: number;
    is_estimated?: boolean;
}

export interface MetaAgentProposalResponse {
    drafts: MetaAgentDraftEntity[];
    connections: MetaAgentProposalConnection[];
    reasoning: string;
    context_stats?: MetaAgentContextStats;
}

export const metaAgentApi = {
    proposeDraft: async (request: MetaAgentProposalRequest): Promise<MetaAgentProposalResponse> => {
        return await authenticatedClient.post<MetaAgentProposalResponse>('/meta-agent/propose', request);
    }
};
