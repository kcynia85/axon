import { useState } from "react";
import type {
	FormPropertyTableProps,
	FormPropertyTableItem,
} from "@/shared/types/form/FormPropertyTable.types";

export const useFormPropertyTable = ({
	items,
	onChange,
	onBlur,
	typeOptions,
}: FormPropertyTableProps) => {
	const [inputValue, setInputValue] = useState("");

	const handleAdd = () => {
		const val = inputValue.trim();
		if (val) {
			onChange([
				...items,
				{ 
					id: crypto.randomUUID(),
					name: val, 
					field_type: typeOptions[0].value, 
					is_required: true 
				},
			]);
			setInputValue("");
			onBlur?.();
		}
	};

	const handleRemove = (index: number) => {
		const next = [...items];
		next.splice(index, 1);
		onChange(next);
		onBlur?.();
	};

	const handleItemChange = (
		index: number,
		changes: Partial<FormPropertyTableItem>,
	) => {
		const next = [...items];
		next[index] = { ...next[index], ...changes };
		onChange(next);
	};

	return {
		inputValue,
		setInputValue,
		handleAdd,
		handleRemove,
		handleItemChange,
	};
};
