export const AUTOMATION_STUDIO_SECTIONS = [
	{
		id: "definition",
		number: 1,
		title: "Definition",
		description: "Describe the purpose and semantics of this automation",
	},
	{
		id: "connection",
		number: 2,
		title: "Connection Configuration",
		description: "Configure the technical bridge to the automation platform",
	},
	{
		id: "authorization",
		number: 3,
		title: "Authorization",
		description: "Configure access credentials and security",
	},
	{
		id: "context",
		number: 4,
		title: "Context",
		description: "Define input context parameters for this automation",
	},
	{
		id: "artefacts",
		number: 5,
		title: "Artefacts",
		description: "Define output artefacts and results",
	},
	{
		id: "availability",
		number: 6,
		title: "Availability",
		description: "Control who can access and use this service",
	},
] as const;

export type AutomationStudioSectionId = (typeof AUTOMATION_STUDIO_SECTIONS)[number]["id"];
