import type { LucideIcon } from "lucide-react";

export type FormCheckboxProps = {
	readonly checked: boolean;
	readonly onChange: (checked: boolean) => void;
	readonly title: string;
	readonly description?: string;
	readonly icon?: LucideIcon;
	readonly className?: string;
	readonly hideCheckbox?: boolean;
	readonly tags?: readonly string[];
};
