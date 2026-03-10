import { type KeyboardEvent, useRef, useState } from "react";
import type { FormTagInputProps } from "@/shared/types/form/FormTagInput.types";

export const useFormTagInput = ({
	value = [],
	onChange,
	onBlur,
}: FormTagInputProps) => {
	const [inputValue, setInputValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const addTag = () => {
		const newTag = inputValue.trim();
		if (newTag && !value.includes(newTag)) {
			onChange?.([...value, newTag]);
		}
		setInputValue("");
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag();
		} else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
			removeTag(value[value.length - 1]);
		}
	};

	const handleBlur = () => {
		if (inputValue.trim()) {
			addTag();
		}
		onBlur?.();
	};

	const removeTag = (tagToRemove: string) => {
		onChange?.(value.filter((tag) => tag !== tagToRemove));
	};

	return {
		inputValue,
		setInputValue,
		inputRef,
		handleKeyDown,
		handleBlur,
		removeTag,
		tags: value,
	};
};
