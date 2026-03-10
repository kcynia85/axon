export type SearchableSelectOption = {
	readonly id: string;
	readonly name: string;
	readonly subtitle?: string;
};

export type SearchableSelectProps = {
	readonly options: SearchableSelectOption[];
	readonly value: string | string[];
	readonly onChange: (value: string | string[]) => void;
	readonly multiple?: boolean;
	readonly placeholder?: string;
	readonly searchPlaceholder?: string;
	readonly className?: string;
	readonly renderTrigger?: (
		selectedOptions: SearchableSelectOption[],
	) => React.ReactNode;
};
