import { useState } from "react";
import type { PropertyTableInputProps, PropertyTableItem } from "./PropertyTableInput.types";

export const usePropertyTableInput = ({
	items,
	onChange,
	onBlur,
	typeOptions,
}: PropertyTableInputProps) => {
	const [inputValue, setInputValue] = useState("");

	const handleAdd = () => {
		const val = inputValue.trim();
		if (val) {
			onChange([
				...items,
				{ name: val, field_type: typeOptions[0].value, is_required: true },
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
		changes: Partial<PropertyTableItem>,
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
