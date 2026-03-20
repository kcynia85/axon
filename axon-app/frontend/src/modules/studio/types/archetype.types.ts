import type React from "react";
import type { LucideIcon } from "lucide-react";

export type StudioArchetype = {
	readonly id: string;
	readonly name: string;
	readonly description: string;
	readonly category: string;
	readonly icon: string | LucideIcon;
	readonly config: Record<string, unknown>;
};
