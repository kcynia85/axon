import { useState } from "react";
import type { FormDynamicListProps } from "@/shared/types/form/FormDynamicList.types";

export const useFormDynamicList = ({
	items,
	onChange,
	onBlur,
}: FormDynamicListProps) => {
	const [inputValue, setInputValue] = useState("");

	const handleAdd = () => {
		const val = inputValue.trim();
		if (val) {
			onChange([...items, val]);
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

	const handleChange = (index: number, value: string) => {
		const next = [...items];
		next[index] = value;
		onChange(next);
	};

	return {
		inputValue,
		setInputValue,
		handleAdd,
		handleRemove,
		handleChange,
	};
};
