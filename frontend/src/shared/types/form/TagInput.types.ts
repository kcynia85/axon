export type TagInputProps = {
	readonly value?: string[];
	readonly onChange?: (value: string[]) => void;
	readonly onBlur?: () => void;
	readonly placeholder?: string;
	readonly className?: string;
};
