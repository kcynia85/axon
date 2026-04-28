export const AUTOMATION_STUDIO_SECTIONS = [
	{
		id: "definition",
		number: 1,
		title: "Definicja i Wyzwalacz",
		description: "Określ cel automatyzacji oraz skonfiguruj Webhook",
	},
	{
		id: "context",
		number: 2,
		title: "Kontekst Wejściowy",
		description: "Zdefiniuj parametry wejściowe dla tej automatyzacji",
	},
	{
		id: "artefacts",
		number: 3,
		title: "Artefakty Wyjściowe",
		description: "Zdefiniuj dane wyjściowe i rezultaty",
	},
	{
		id: "availability",
		number: 4,
		title: "Dostępność",
		description: "Kontroluj dostęp do tej automatyzacji",
	},
] as const;

export type AutomationStudioSectionId = (typeof AUTOMATION_STUDIO_SECTIONS)[number]["id"];
