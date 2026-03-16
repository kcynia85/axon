import type React from "react";
import type { LucideIcon } from "lucide-react";
import type { StudioArchetype } from "./archetype.types";

export type { StudioArchetype };

export type StudioDiscoveryProps = {
	readonly title: string;
	readonly emptyLabel: string;
	readonly emptySublabel: string;
	readonly libraryLabel: string;
	readonly librarySublabel: string;
	readonly archetypes: readonly StudioArchetype[];
	readonly categories: readonly string[];
	readonly onSelectEmpty: () => void;
	readonly onSelectArchetype: (archetype: StudioArchetype) => void;
	readonly onExit: () => void;
	readonly renderIcon: (
		iconName: string | LucideIcon,
		size?: number,
		className?: string,
	) => React.ReactNode;
};

export type StudioEntryProps = {
	readonly emptyLabel: string;
	readonly emptySublabel: string;
	readonly libraryLabel: string;
	readonly librarySublabel: string;
	readonly onSelectEmpty: () => void;
	readonly onShowLibrary: () => void;
	readonly onExit: () => void;
};

export type DiscoveryChoiceProps = StudioEntryProps;

export type ArchetypeCardProps = {
	readonly archetype: StudioArchetype;
	readonly onSelect: (archetype: StudioArchetype) => void;
	readonly renderIcon: (
		iconName: string | LucideIcon,
		size?: number,
		className?: string,
	) => React.ReactNode;
};

export type ArchetypeBlueprintProps = ArchetypeCardProps;

export type DiscoveryLibraryProps = {
	readonly title: string;
	readonly searchQuery: string;
	readonly setSearchQuery: (query: string) => void;
	readonly activeCategory: string;
	readonly setActiveCategory: (category: string) => void;
	readonly allCategories: readonly string[];
	readonly displayedArchetypes: readonly StudioArchetype[];
	readonly onBack: () => void;
	readonly onSelectArchetype: (archetype: StudioArchetype) => void;
	readonly renderIcon: (
		iconName: string | LucideIcon,
		size?: number,
		className?: string,
	) => React.ReactNode;
};

export type ArchetypeCatalogProps = DiscoveryLibraryProps;

export type UseStudioDiscoveryProps = {
	readonly archetypes: readonly StudioArchetype[];
	readonly categories: readonly string[];
};
