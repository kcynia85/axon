import type React from "react";

export type FormSelectOption = {
        readonly id: string;
        readonly name: string;
        readonly subtitle?: string;
        readonly avatarUrl?: string;
        readonly variant?: "default" | "success" | "warning" | "error" | "info";
        readonly disabled?: boolean;
        readonly badgeLabel?: string;
};
export type FormSelectProps = {
	readonly options: FormSelectOption[];
	readonly value: string | string[];
	readonly onChange: (value: string | string[]) => void;
	readonly multiple?: boolean;
	readonly placeholder?: string;
	readonly searchPlaceholder?: string;
	readonly className?: string;
	readonly hideRecent?: boolean;
	readonly renderTrigger?: (
		selectedOptions: FormSelectOption[],
	) => React.ReactNode;
};
