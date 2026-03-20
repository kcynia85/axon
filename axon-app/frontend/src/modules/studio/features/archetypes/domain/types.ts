export type ArchetypeId = string;
export type WorkspaceId = string;
export type KnowledgeHubId = string;

export type ArchetypeDraft = {
	readonly role: string;
	readonly goal: string;
	readonly backstory: string;
	readonly keywords: string[];
	readonly knowledgeHubIds: KnowledgeHubId[];
	readonly instructions: string[];
	readonly constraints: string[];
	readonly isGlobalAccess: boolean;
	readonly workspaceIds: WorkspaceId[];
};
