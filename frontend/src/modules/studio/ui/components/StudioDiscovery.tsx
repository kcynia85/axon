"use client";

import { AnimatePresence } from "framer-motion";
import type React from "react";
import { useStudioDiscovery } from "../../application/hooks/useStudioDiscovery";
import type { StudioDiscoveryProps } from "../../types/discovery.types";
import { StudioEntry } from "./discovery/StudioEntry";
import { ArchetypeCatalog } from "./discovery/ArchetypeCatalog";

/**
 * StudioDiscovery: Generic entry point for the agent blueprinting process.
 */
export const StudioDiscovery = ({
	title,
	emptyLabel,
	emptySublabel,
	libraryLabel,
	librarySublabel,
	archetypes,
	categories,
	onSelectEmpty,
	onSelectArchetype,
	onExit,
	renderIcon,
}: StudioDiscoveryProps) => {
	const {
		showLibrary,
		setShowLibrary,
		searchQuery,
		setSearchQuery,
		activeCategory,
		setActiveCategory,
		displayedArchetypes,
		allCategories,
	} = useStudioDiscovery({ archetypes, categories });

	return (
		<div className="fixed inset-0 z-[200] bg-black flex overflow-hidden font-sans">
			<AnimatePresence mode="wait">
				{!showLibrary ? (
					<StudioEntry
						emptyLabel={emptyLabel}
						emptySublabel={emptySublabel}
						libraryLabel={libraryLabel}
						librarySublabel={librarySublabel}
						onSelectEmpty={onSelectEmpty}
						onShowLibrary={() => setShowLibrary(true)}
						onExit={onExit}
					/>
				) : (
					<ArchetypeCatalog
						title={title}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						activeCategory={activeCategory}
						setActiveCategory={setActiveCategory}
						allCategories={allCategories}
						displayedArchetypes={displayedArchetypes}
						onBack={() => setShowLibrary(false)}
						onSelectArchetype={onSelectArchetype}
						renderIcon={renderIcon}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};
