import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { ChunkingStrategy } from "@/shared/domain/settings";
import { ReactNode } from "react";

export type DisplayChunkingStrategy = ChunkingStrategy & {
    readonly title: string;
    readonly description: string;
    readonly categories: readonly string[];
    readonly isModified?: boolean;
};

export type ChunkingStrategiesListViewProps = {
    readonly search: string;
    readonly onSearchChange: (query: string) => void;
    readonly viewMode: "grid" | "list";
    readonly setViewMode: (mode: "grid" | "list") => void;
    readonly sortBy: string;
    readonly onSortChange: (sortBy: string) => void;
    readonly activeFilters: readonly ActiveFilter[];
    readonly filterGroups: readonly FilterGroup[];
    readonly quickFilters: readonly QuickFilter[];
    readonly sortOptions: readonly SortOption[];
    readonly onToggleFilter: (id: string) => void;
    readonly onRemoveFilter: (id: string) => void;
    readonly onClearAllFilters: () => void;
    readonly onApplyFilters: (selectedIds: string[]) => void;
    readonly onSelectionChange: (selectedIds: string[]) => void;
    readonly displayStrategies: readonly DisplayChunkingStrategy[];
    readonly previewCount: number;
    readonly isLoading: boolean;
    readonly newDraft: ChunkingStrategy | null;
    readonly onDiscardDraft: (e: React.MouseEvent) => void;
    readonly onNewDraftClick: () => void;
    readonly onStrategyClick: (strategy: ChunkingStrategy) => void;
    readonly onEditStrategy: (id: string) => void;
    readonly onDeleteStrategy: (id: string, name: string) => void;
    readonly selectedStrategy: ChunkingStrategy | null;
    readonly setSelectedStrategy: (strategy: ChunkingStrategy | null) => void;
    readonly deleteModalOpen: boolean;
    readonly setDeleteModalOpen: (open: boolean) => void;
    readonly strategyToDelete: { id: string; name: string } | null;
    readonly onDeleteExecution: () => void;
};

