import { useState, useMemo, useCallback } from "react";
import type { FilterGroup } from "@/shared/domain/filters";

export type BaseSpace = {
	readonly id: string;
	readonly name: string;
	readonly description: string;
	readonly status?: string;
    readonly created_at?: string;
};

export type SpaceViewItem = BaseSpace & {
	readonly isSelected: boolean;
	readonly isAlreadyAssigned: boolean;
};

export const useProjectSpaceModal = (
	isOpen: boolean,
	onOpenChangeProp: (open: boolean) => void,
	availableSpaces: readonly BaseSpace[],
	selectedSpaceIds: readonly string[],
	usedSpaceIds: readonly string[] = []
) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
	const [pendingStatuses, setPendingStatuses] = useState<string[]>([]);

	// Extract unique statuses from availableSpaces
	const statuses = useMemo(() => {
		const uniqueStatuses = new Set<string>();
		for (const space of availableSpaces) {
			if (space.status) {
				uniqueStatuses.add(space.status);
			}
		}
		return Array.from(uniqueStatuses).sort();
	}, [availableSpaces]);

	// Create FilterGroup for statuses
	const filterGroups: FilterGroup[] = useMemo(() => {
		return [
			{
				id: "status",
				title: "Status",
				type: "checkbox",
				options: statuses.map((status) => ({
					id: status,
					label: status,
					isChecked: selectedStatuses.includes(status),
				})),
			},
		];
	}, [statuses, selectedStatuses]);

	const handleApplyFilters = useCallback((selectedIds: string[]) => {
		setSelectedStatuses(selectedIds);
		setPendingStatuses(selectedIds);
	}, []);

	const handleSelectionChange = useCallback((selectedIds: string[]) => {
		setPendingStatuses(selectedIds);
	}, []);

	const handleClearFilters = useCallback(() => {
		setSelectedStatuses([]);
		setPendingStatuses([]);
	}, []);

	// Calculate preview count based on pending statuses
	const previewCount = useMemo(() => {
		return availableSpaces.filter((space) => {
			const matchesSearch =
				searchQuery === "" ||
				space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				space.description.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus =
				pendingStatuses.length === 0 ||
				(space.status && pendingStatuses.includes(space.status));

			return matchesSearch && matchesStatus;
		}).length;
	}, [availableSpaces, searchQuery, pendingStatuses]);

	// Filter spaces based on search query and selected statuses and map to ViewItem
	const filteredSpaces: readonly SpaceViewItem[] = useMemo(() => {
		return availableSpaces
			.filter((space) => {
				// 1. Hide if assigned to another project
				if ((usedSpaceIds || []).includes(space.id)) {
					return false;
				}

				// 2. Filter by search query
				const matchesSearch =
					searchQuery === "" ||
					space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					space.description.toLowerCase().includes(searchQuery.toLowerCase());

				// 3. Filter by status
				const matchesStatus =
					selectedStatuses.length === 0 ||
					(space.status && selectedStatuses.includes(space.status));

				return matchesSearch && matchesStatus;
			})
			.map((space) => ({
				...space,
				isSelected: (selectedSpaceIds || []).includes(space.id),
				isAlreadyAssigned: false, // No longer needed for UI as they are hidden
			}));
	}, [availableSpaces, searchQuery, selectedStatuses, selectedSpaceIds, usedSpaceIds]);

	// Reset state when modal closes
	const handleOpenChange = useCallback((open: boolean) => {
		if (!open) {
			setSearchQuery("");
			setSelectedStatuses([]);
			setPendingStatuses([]);
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
		filteredSpaces,
		handleOpenChange,
	};
};
