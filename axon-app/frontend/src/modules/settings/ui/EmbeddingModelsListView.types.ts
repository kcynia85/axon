import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { EmbeddingModel } from "@/shared/domain/settings";
import { ReactNode } from "react";

export type DisplayEmbeddingModel = EmbeddingModel & {
    readonly title: string;
    readonly description: string;
    readonly categories: readonly string[];
    readonly isModified?: boolean;
};

export type EmbeddingModelsListViewProps = {
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
    readonly displayModels: readonly DisplayEmbeddingModel[];
    readonly previewCount: number;
    readonly isLoading: boolean;
    readonly newDraft: EmbeddingModel | null;
    readonly onDiscardDraft: (e: React.MouseEvent) => void;
    readonly onNewDraftClick: () => void;
    readonly onModelClick: (model: EmbeddingModel) => void;
    readonly onEditModel: (id: string) => void;
    readonly onDeleteModel: (id: string, name: string) => void;
    readonly selectedModel: EmbeddingModel | null;
    readonly setSelectedModel: (model: EmbeddingModel | null) => void;
    readonly deleteModalOpen: boolean;
    readonly setDeleteModalOpen: (open: boolean) => void;
    readonly modelToDelete: { id: string; name: string } | null;
    readonly onDeleteExecution: () => void;
};

