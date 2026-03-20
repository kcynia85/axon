export type FormPropertyFieldType =
	| "string"
	| "number"
	| "boolean"
	| "json"
	| "file"
	| "markdown"
	| "image";

export type FormPropertyTableItem = {
	readonly id?: string;
	readonly name: string;
	readonly field_type: FormPropertyFieldType;
	readonly is_required: boolean;
};

export type FormPropertyTableProps = {
	readonly items: FormPropertyTableItem[];
	readonly onChange: (items: FormPropertyTableItem[]) => void;
	readonly onBlur?: () => void;
	readonly namePlaceholder?: string;
	readonly addPlaceholder?: string;
	readonly typeOptions: {
		readonly label: string;
		readonly value: FormPropertyFieldType;
	}[];
};
