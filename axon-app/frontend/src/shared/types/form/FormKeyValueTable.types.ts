import type React from "react";

export type FormKeyValueItem = {
	readonly id: string;
	readonly key: string;
	readonly value: string;
};

export type FormKeyValueTableProps = {
	readonly items: FormKeyValueItem[];
	readonly onChange: (items: FormKeyValueItem[]) => void;
	readonly onBlur?: () => void;
	readonly keyPlaceholder?: string;
	readonly valuePlaceholder?: string;
	readonly addPlaceholder?: string;
};
