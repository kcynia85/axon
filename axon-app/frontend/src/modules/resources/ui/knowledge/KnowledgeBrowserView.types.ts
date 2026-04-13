import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";

export type KnowledgeResource = {
    id: string;
    title: string;
    tags: string[];
    type: string;
    status: "Pending" | "Indexing" | "Ready" | "Error";
    vectorDatabaseName?: string;
    hubName?: string;
    hubId?: string;
    chunkCount?: number;
};

export type KnowledgeBrowserViewProps = {
    readonly searchQuery: string;
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
    readonly filteredResources: readonly KnowledgeResource[];
    readonly previewCount: number;
    readonly onDelete: (resource: KnowledgeResource) => void;
    readonly onEdit: (resource: KnowledgeResource) => void;
};
