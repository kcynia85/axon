import type { LucideIcon } from "lucide-react";

export type SelectableCardProps = {
	readonly checked: boolean;
	readonly onChange: (checked: boolean) => void;
	readonly title: string;
	readonly description?: string;
	readonly icon?: LucideIcon;
	readonly disabled?: boolean;
	readonly className?: string;
};
