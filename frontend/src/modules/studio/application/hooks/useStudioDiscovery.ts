import { useMemo, useState } from "react";
import type { UseStudioDiscoveryProps } from "../../types/studio.types";

export const useStudioDiscovery = ({
	archetypes,
	categories,
}: UseStudioDiscoveryProps) => {
	const [showLibrary, setShowLibrary] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");

	const allCategories = useMemo(
		() => ["All", ...categories],
		[categories],
	);

	const displayedArchetypes = useMemo(() => {
		const filtered = archetypes.filter(
			(a) =>
				a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				a.category.toLowerCase().includes(searchQuery.toLowerCase()),
		);

		if (activeCategory === "All") {
			return filtered;
		}

		return filtered.filter((a) => a.category === activeCategory);
	}, [archetypes, searchQuery, activeCategory]);

	return {
		showLibrary,
		setShowLibrary,
		searchQuery,
		setSearchQuery,
		activeCategory,
		setActiveCategory,
		displayedArchetypes,
		allCategories,
	};
};
