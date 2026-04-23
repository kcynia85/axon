import { useMemo, useState } from "react";
import type { FormSelectProps } from "@/shared/types/form/FormSelect.types";

export const useFormSelect = ({
	options,
	value,
	onChange,
	multiple,
}: FormSelectProps) => {
	const [search, setSearch] = useState("");

	const selectedIds = useMemo(() => {
		if (!value) return [];
		return Array.isArray(value) ? value : [value];
	}, [value]);

	const selectedOptions = useMemo(() => {
		return options.filter((opt) => selectedIds.includes(opt.id));
	}, [options, selectedIds]);

	const filteredOptions = useMemo(() => {
		return options.filter((opt) =>
			opt.name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [options, search]);

	const handleSelect = (id: string) => {
		if (multiple) {
			const nextValue = selectedIds.includes(id)
				? selectedIds.filter((v) => v !== id)
				: [...selectedIds, id];
			onChange(nextValue);
		} else {
			onChange(id);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setSearch("");
		}
	};

	return {
		search,
		setSearch,
		selectedIds,
		selectedOptions,
		filteredOptions,
		handleSelect,
		handleOpenChange,
	};
};
