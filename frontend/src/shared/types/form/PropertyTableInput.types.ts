export type PropertyFieldType =
	| "string"
	| "number"
	| "boolean"
	| "json"
	| "file"
	| "markdown"
	| "image";

export type PropertyTableItem = {
	readonly id?: string;
	readonly name: string;
	readonly field_type: PropertyFieldType;
	readonly is_required: boolean;
};

export type PropertyTableInputProps = {
	readonly items: PropertyTableItem[];
	readonly onChange: (items: PropertyTableItem[]) => void;
	readonly onBlur?: () => void;
	readonly namePlaceholder?: string;
	readonly addPlaceholder?: string;
	readonly typeOptions: {
		readonly label: string;
		readonly value: PropertyFieldType;
	}[];
};
