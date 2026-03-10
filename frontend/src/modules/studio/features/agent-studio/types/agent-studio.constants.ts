import { Globe, Code, Database, Shield, Zap, Search, Info } from "lucide-react";
import type { FormPropertyFieldType } from "@/shared/types/form/FormPropertyTable.types";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { LLMModel, KnowledgeHub } from "./agent-studio.types";
import type { AvatarItem } from "./components.types";

export const AVATARS: readonly AvatarItem[] = [
	{ id: 1, url: "/images/avatars/agent-1.png" },
	{ id: 2, url: "/images/avatars/agent-2.png" },
	{ id: 3, url: "/images/avatars/agent-3.png" },
	{ id: 4, url: "/images/avatars/agent-4.png" },
	{ id: 5, url: "/images/avatars/agent-5.png" },
];

export const ALL_MODELS: readonly LLMModel[] = [
	{ id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", cost: "High" },
	{ id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", cost: "Low" },
	{ id: "gpt-4o", name: "GPT-4o", cost: "Mid" },
	{ id: "gpt-4-turbo", name: "GPT-4 Turbo", cost: "High" },
	{ id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", cost: "Mid" },
	{ id: "claude-3-opus", name: "Claude 3 Opus", cost: "High" },
];

export const ALL_HUBS: readonly KnowledgeHub[] = [
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

export const NATIVE_SKILLS = [
	{ id: "web_search", name: "Web Search", icon: Globe },
	{ id: "code_interpreter", name: "Code Interpreter", icon: Code },
	{ id: "file_browser", name: "File Browser", icon: Database },
] as const;

export const CUSTOM_FUNCTIONS = [
	{
		id: "lead_scoring",
		name: "lead_scoring",
		desc: "Oblicza potencjał leada...",
	},
	{
		id: "validate_nip_pl",
		name: "validate_nip_pl",
		desc: "Sprawdza sumę kontrolną...",
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

export const MODEL_NAMES: Record<string, string> = {
	"gemini-2.5-pro": "Gemini 2.5 Pro",
	"gemini-2.0-flash": "Gemini 2.0 Flash",
	"gpt-4o": "GPT-4o",
};
