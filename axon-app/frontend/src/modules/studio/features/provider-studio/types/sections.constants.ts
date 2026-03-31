import { ShieldCheck, Coins, Database, Zap, LayoutGrid, Search } from "lucide-react";

export type ProviderStudioSectionId = "type-selection" | "auth" | "tokenization" | "schema" | "adapter" | "discovery";

export const PROVIDER_STUDIO_SECTIONS = [
	{
		id: "auth" as ProviderStudioSectionId,
		number: 1,
		title: "Auth & Connection",
	},
	{
		id: "type-selection" as ProviderStudioSectionId,
		number: 2,
		title: "Provider Type Selection",
	},
	{
		id: "tokenization" as ProviderStudioSectionId,
		number: 3,
		title: "Tokenizer",
	},
	{
		id: "schema" as ProviderStudioSectionId,
		number: 4,
		title: "Definicja Parametrów JSON",
	},
	{
		id: "adapter" as ProviderStudioSectionId,
		number: 5,
		title: "Mapowanie Kluczy API (Adapter)",
	},
] as const;


