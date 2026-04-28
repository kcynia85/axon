export type AutomationProviderStudioSectionId = "identity" | "auth";

export const AUTOMATION_PROVIDER_STUDIO_SECTIONS = [
	{
		id: "identity" as AutomationProviderStudioSectionId,
		title: "Tożsamość",
		subtitle: "Nazwa i platforma",
		number: 1,
	},
	{
		id: "auth" as AutomationProviderStudioSectionId,
		title: "Autoryzacja",
		subtitle: "Połączenie API",
		number: 2,
	}
] as const;
