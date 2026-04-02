import { useState, useMemo, useCallback } from "react";
import type { FilterGroup } from "@/shared/domain/filters";

export type BaseSkill = {
	readonly id: string;
	readonly uuid?: string; // Add optional UUID for hydration
	readonly name: string;
	readonly desc: string;
	readonly category?: string;
	readonly keywords?: readonly string[];
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
	const [pendingCategories, setPendingCategories] = useState<string[]>([]);

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
		setPendingCategories(selectedIds);
	}, []);

	const handleSelectionChange = useCallback((selectedIds: string[]) => {
		setPendingCategories(selectedIds);
	}, []);

	const handleClearFilters = useCallback(() => {
		setSelectedCategories([]);
		setPendingCategories([]);
	}, []);

	// Calculate preview count based on pending categories
	const previewCount = useMemo(() => {
		return availableSkills.filter((fn) => {
			const matchesSearch =
				searchQuery === "" ||
				fn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				fn.desc.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesCategory =
				pendingCategories.length === 0 ||
				(fn.category && pendingCategories.includes(fn.category));

			return matchesSearch && matchesCategory;
		}).length;
	}, [availableSkills, searchQuery, pendingCategories]);

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
				isAdded: (addedFunctionIds || []).includes(fn.id) || (fn.uuid ? (addedFunctionIds || []).includes(fn.uuid) : false),
			}));
	}, [availableSkills, searchQuery, selectedCategories, addedFunctionIds]);

	// Reset state when modal closes
	const handleOpenChange = useCallback((open: boolean) => {
		if (!open) {
			setSearchQuery("");
			setSelectedCategories([]);
			setPendingCategories([]);
		}
		onOpenChangeProp(open);
	}, [onOpenChangeProp]);

	return {
		searchQuery,
		setSearchQuery,
		filterGroups,
		handleApplyFilters,
		handleSelectionChange,
		handleClearFilters,
		previewCount,
		filteredSkills,
		handleOpenChange,
	};
};
