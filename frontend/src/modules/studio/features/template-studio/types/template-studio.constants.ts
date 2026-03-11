import type { FormPropertyFieldType } from "@/shared/types/form/FormPropertyTable.types";

export const TEMPLATE_STUDIO_SECTIONS = [
	{ id: "definition", title: "Definition", number: 1 },
	{ id: "actions", title: "Actions", number: 2 },
	{ id: "context", title: "Context", number: 3 },
	{ id: "artefacts", title: "Artefacts", number: 4 },
	{ id: "availability", title: "Availability", number: 5 },
] as const;

export type TemplateStudioSectionId = (typeof TEMPLATE_STUDIO_SECTIONS)[number]["id"];

export const CONTEXT_PROPERTY_TYPES: {
	readonly label: string;
	readonly value: FormPropertyFieldType;
}[] = [
	{ label: "LINK", value: "string" },
	{ label: "TEXT", value: "string" },
	{ label: "FILE", value: "file" },
	{ label: "JSON", value: "json" },
];

export const ARTEFACT_PROPERTY_TYPES: {
	readonly label: string;
	readonly value: FormPropertyFieldType;
}[] = [
	{ label: "FILE", value: "file" },
	{ label: "LINK", value: "string" },
	{ label: "MARKDOWN", value: "markdown" },
	{ label: "JSON", value: "json" },
];

export const DEPLOYMENT_SCOPES = [
	"Global",
	"Product Management",
	"Discovery",
	"Design",
	"Delivery",
	"Growth & Market",
] as const;
