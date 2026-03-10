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

export const ALL_MODELS: LLMModel[] = [
	{ id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", cost: "High" },
	{ id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", cost: "Low" },
	{ id: "gpt-4o", name: "GPT-4o", cost: "Mid" },
	{ id: "gpt-4-turbo", name: "GPT-4 Turbo", cost: "High" },
	{ id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", cost: "Mid" },
	{ id: "claude-3-opus", name: "Claude 3 Opus", cost: "High" },
];

export const ALL_HUBS: KnowledgeHub[] = [
	{
		id: "hub-1",
		name: "Internal Wiki",
		type: "Project Docs",
		index: "vector-index-titan-v2",
	},
	{
		id: "hub-2",
		name: "Product Specs",
		type: "Technical",
		index: "vector-index-specs-v1",
	},
	{
		id: "hub-3",
		name: "Customer Feedback",
		type: "Research",
		index: "vector-index-feedback",
	},
	{
		id: "hub-4",
		name: "Market Reports",
		type: "Research",
		index: "vector-index-market",
	},
];

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
