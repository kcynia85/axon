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
			(archetype) =>
				archetype.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				archetype.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				archetype.category.toLowerCase().includes(searchQuery.toLowerCase()),
		);

		if (activeCategory === "All") {
			return filtered;
		}

		return filtered.filter((archetype) => archetype.category === activeCategory);
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
