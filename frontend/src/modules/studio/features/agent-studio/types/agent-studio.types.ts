import type { UseFormReturn } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";

export type LLMModel = {
	readonly id: string;
	readonly name: string;
	readonly cost: string;
};

export type KnowledgeHub = {
	readonly id: string;
	readonly name: string;
	readonly type: string;
	readonly index: string;
};

export type AgentStudioStep = "discovery" | "design";

export type AgentStudioSectionId =
	| "IDENTITY"
	| "MEMORY"
	| "ENGINE"
	| "SKILLS"
	| "INTERFACE"
	| "AVAILABILITY";

export type AgentStudioState = {
	readonly step: AgentStudioStep;
	readonly activeSection: AgentStudioSectionId;
};

export type AgentFormContextType = UseFormReturn<CreateAgentFormData>;
