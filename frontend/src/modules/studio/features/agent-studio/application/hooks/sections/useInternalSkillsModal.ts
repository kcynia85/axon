import { useState, useMemo, useCallback } from "react";
import type { FilterGroup } from "@/shared/domain/filters";

export type BaseSkill = {
	readonly id: string;
	readonly name: string;
	readonly desc: string;
	readonly category?: string;
};

export type SkillViewItem = BaseSkill & {
	readonly isAdded: boolean;
};

export const useInternalSkillsModal = (
	isOpen: boolean,
	onOpenChangeProp: (open: boolean) => void,
	availableSkills: readonly BaseSkill[],
	addedFunctionIds: readonly string[]
) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	// Extract unique categories from availableSkills
	const categories = useMemo(() => {
		const uniqueCategories = new Set<string>();
		for (const fn of availableSkills) {
			if (fn.category) {
				uniqueCategories.add(fn.category);
			}
		}
		return Array.from(uniqueCategories).sort();
	}, [availableSkills]);

	// Create FilterGroup for categories
	const filterGroups: FilterGroup[] = useMemo(() => {
		return [
			{
				id: "category",
				title: "Kategoria",
				type: "checkbox",
				options: categories.map((cat) => ({
					id: cat,
					label: cat,
					isChecked: selectedCategories.includes(cat),
				})),
			},
		];
	}, [categories, selectedCategories]);

	const handleApplyFilters = useCallback((selectedIds: string[]) => {
		setSelectedCategories(selectedIds);
	}, []);

	const handleClearFilters = useCallback(() => {
		setSelectedCategories([]);
	}, []);

	// Filter functions based on search query and selected categories and map to ViewItem
	const filteredSkills: readonly SkillViewItem[] = useMemo(() => {
		return availableSkills
			.filter((fn) => {
				const matchesSearch =
					searchQuery === "" ||
					fn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					fn.desc.toLowerCase().includes(searchQuery.toLowerCase());

				const matchesCategory =
					selectedCategories.length === 0 ||
					(fn.category && selectedCategories.includes(fn.category));

				return matchesSearch && matchesCategory;
			})
			.map((fn) => ({
				...fn,
				isAdded: addedFunctionIds.includes(fn.id),
			}));
	}, [availableSkills, searchQuery, selectedCategories, addedFunctionIds]);

	// Reset state when modal closes
	const handleOpenChange = useCallback((open: boolean) => {
		if (!open) {
			setSearchQuery("");
			setSelectedCategories([]);
		}
		onOpenChangeProp(open);
	}, [onOpenChangeProp]);

	return {
		searchQuery,
		setSearchQuery,
		filterGroups,
		handleApplyFilters,
		handleClearFilters,
		filteredSkills,
		handleOpenChange,
	};
};
