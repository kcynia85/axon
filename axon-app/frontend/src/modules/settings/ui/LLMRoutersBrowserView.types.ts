import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { LLMRouter } from "@/shared/domain/settings";

export type DisplayLLMRouter = LLMRouter & {
    readonly title: string;
    readonly description: string;
    readonly categories: readonly string[];
    readonly isMock?: boolean;
};

export type LLMRoutersBrowserViewProps = {
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
    readonly filteredRouters: readonly DisplayLLMRouter[];
    readonly previewCount: number;
    readonly isLoading: boolean;
    readonly isError: boolean;
    readonly selectedRouter: DisplayLLMRouter | null;
    readonly onRouterClick: (router: DisplayLLMRouter) => void;
    readonly onConfigureRouter: (router: DisplayLLMRouter) => void;
    readonly onDeleteRouter: (id: string) => void;
    readonly onCloseSidePeek: () => void;
    readonly deleteModalOpen: boolean;
    readonly onCancelDelete: () => void;
    readonly onConfirmDelete: () => void;
    readonly routerToDeleteName?: string;
};

