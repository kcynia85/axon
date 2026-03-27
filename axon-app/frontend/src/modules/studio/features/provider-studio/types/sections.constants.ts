import { ShieldCheck, Coins, Database, Zap, LayoutGrid } from "lucide-react";

export type ProviderStudioSectionId = "type-selection" | "auth" | "tokenization" | "schema" | "adapter";

export const PROVIDER_STUDIO_SECTIONS = [
	{
		id: "auth" as ProviderStudioSectionId,
		number: 1,
		title: "Auth & Connection",
		icon: ShieldCheck,
	},
	{
		id: "type-selection" as ProviderStudioSectionId,
		number: 2,
		title: "Provider Type Selection",
		icon: LayoutGrid,
	},
	{
		id: "tokenization" as ProviderStudioSectionId,
		number: 3,
		title: "Tokenization Strategy",
		icon: Coins,
	},
	{
		id: "schema" as ProviderStudioSectionId,
		number: 4,
		title: "JSON Parameters Schema",
		icon: Database,
	},
	{
		id: "adapter" as ProviderStudioSectionId,
		number: 5,
		title: "API Keys Adapter",
		icon: Zap,
	},
] as const;
