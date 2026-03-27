export const ROUTER_STRATEGIES = [
	{
		id: "fallback",
		title: "Fallback (Kaskada)",
		description: "Próbuj kolejno modele z listy, jeśli poprzedni zawiedzie lub przekroczy timeout.",
	},
	{
		id: "load_balancer",
		title: "Load Balancer",
		description: "Rozdzielaj ruch pomiędzy dostępne modele w celu optymalizacji obciążenia.",
	},
] as const;

export type RouterSectionIdentifier = "general" | "priority-chain";

export const ROUTER_STUDIO_SECTIONS = [
	{
		id: "general",
		label: "General Settings",
		number: 1,
	},
	{
		id: "priority-chain",
		label: "Priority Chain",
		number: 2,
	},
] as const;
