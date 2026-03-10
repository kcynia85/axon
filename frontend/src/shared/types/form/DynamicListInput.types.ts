export type DynamicListInputProps = {
	readonly items: string[];
	readonly onChange: (items: string[]) => void;
	readonly onBlur?: () => void;
	readonly placeholder?: string;
	readonly addPlaceholder?: string;
	readonly className?: string;
};
