import { Globe, Code, Database, Shield, Zap, Search, Info } from "lucide-react";
import type { FormPropertyFieldType } from "@/shared/types/form/FormPropertyTable.types";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { LLMModel, KnowledgeHub } from "./agent-studio.types";
import type { AvatarItem } from "./components.types";

export const AVATARS: readonly AvatarItem[] = [
	{ id: 1, url: "/images/avatars/agent-1.webp" },
	{ id: 2, url: "/images/avatars/agent-2.webp" },
	{ id: 3, url: "/images/avatars/agent-3.webp" },
	{ id: 4, url: "/images/avatars/agent-4.webp" },
	{ id: 5, url: "/images/avatars/agent-5.webp" },
];

export const ALL_MODELS: readonly LLMModel[] = [];

export const ALL_HUBS: readonly KnowledgeHub[] = [
	{
		id: "123e4567-e89b-12d3-a456-426614174010",
		name: "Internal Wiki",
		type: "Project Docs",
		index: "vector-index-titan-v2",
	},
	{
		id: "123e4567-e89b-12d3-a456-426614174011",
		name: "Product Specs",
		type: "Technical",
		index: "vector-index-specs-v1",
	},
	{
		id: "123e4567-e89b-12d3-a456-426614174012",
		name: "Customer Feedback",
		type: "Research",
		index: "vector-index-feedback",
	},
	{
		id: "123e4567-e89b-12d3-a456-426614174013",
		name: "Market Reports",
		type: "Research",
		index: "vector-index-market",
	},
];

export const NATIVE_SKILLS = [
	{ id: "web_search", name: "Web Search", icon: Globe },
	{ id: "code_interpreter", name: "Code Interpreter", icon: Code },
	{ id: "file_browser", name: "File Browser", icon: Database },
] as const;

export const CUSTOM_FUNCTIONS = [
	{
		id: "lead_scoring",
		name: "lead_scoring",
		desc: "Calculates lead potential based on revenue...",
		category: "Sales",
	},
	{
		id: "validate_pesel",
		name: "validate_pesel",
		desc: "Verifies the checksum of the PESEL number...",
		category: "Legal",
	},
	{
		id: "sentiment_analysis_local",
		name: "sentiment_analysis_local",
		desc: "Local text sentiment analysis (Positive/Negative).",
		category: "AI Utils",
	},
] as const;

export const CONTEXT_TYPES: {
	readonly label: string;
	readonly value: FormPropertyFieldType;
}[] = [
	{ label: "STRING", value: "string" },
	{ label: "NUMBER", value: "number" },
	{ label: "BOOLEAN", value: "boolean" },
	{ label: "JSON", value: "json" },
];

export const ARTEFACT_TYPES: {
	readonly label: string;
	readonly value: FormPropertyFieldType;
}[] = [
	{ label: "FILE", value: "file" },
	{ label: "MARKDOWN", value: "markdown" },
	{ label: "IMAGE", value: "image" },
	{ label: "STRUCTURED DATA", value: "json" },
];

export const DEPLOYMENT_SCOPES = [
	"Global Availability",
	"Product Management",
	"Discovery Hub",
	"Design System",
	"Delivery & CI/CD",
	"Growth & Market",
] as const;

export type FormFieldType = "text" | "textarea";

export type FormFieldConfig = {
	readonly name: keyof CreateAgentFormData;
	readonly label: string;
	readonly placeholder: string;
	readonly type: FormFieldType;
};

export const IDENTITY_FIELDS: readonly FormFieldConfig[] = [
	{
		name: "agent_name",
		label: "Agent Name",
		placeholder: "Name your agent...",
		type: "text",
	},
	{
		name: "agent_role_text",
		label: "Role",
		placeholder: "What is the role of this agent?",
		type: "text",
	},
	{
		name: "agent_goal",
		label: "Goal",
		placeholder: "What is the primary objective?",
		type: "textarea",
	},
	{
		name: "agent_backstory",
		label: "Backstory",
		placeholder: "Define the backstory and context of this cognitive entity...",
		type: "textarea",
	},
];

export const MODEL_NAMES: Record<string, string> = {};
