import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { VectorDatabase } from "@/shared/domain/settings";

export type DisplayVectorDatabase = VectorDatabase & {
    readonly title: string;
    readonly description: string;
    readonly categories: readonly string[];
    readonly isMock?: boolean;
    readonly status?: "connected" | "disconnected" | "error" | "none";
};

export type VectorDatabasesListViewProps = {
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
    readonly displayItems: readonly DisplayVectorDatabase[];
    readonly previewCount: number;
    readonly isLoading: boolean;
    readonly onDbClick: (db: DisplayVectorDatabase) => void;
    readonly onEditDb: (id: string) => void;
    readonly onAdd: () => void;
    readonly onDeleteDb: (id: string, title: string) => void;
    readonly selectedDb: DisplayVectorDatabase | null;
    readonly deleteModalOpen: boolean;
    readonly onCancelDelete: () => void;
    readonly onConfirmDelete: () => void;
    readonly dbToDeleteName?: string;
    readonly onCloseSidePeek: () => void;
};

