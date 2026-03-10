import { useMemo, useState } from "react";
import type { SearchableSelectProps } from "./SearchableSelect.types";

export const useSearchableSelect = ({
	options,
	value,
	onChange,
	multiple,
}: SearchableSelectProps) => {
	const [search, setSearch] = useState("");
	const [recent, setRecent] = useState<string[]>([]);

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

	const recentOptions = useMemo(() => {
		return options.filter((opt) => recent.includes(opt.id));
	}, [options, recent]);

	const handleSelect = (id: string) => {
		if (multiple) {
			const nextValue = selectedIds.includes(id)
				? selectedIds.filter((v) => v !== id)
				: [...selectedIds, id];
			onChange(nextValue);
		} else {
			onChange(id);
		}

		setRecent((prev) => {
			const next = [id, ...prev.filter((p) => p !== id)].slice(0, 3);
			return next;
		});
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
		recentOptions,
		handleSelect,
		handleOpenChange,
	};
};
