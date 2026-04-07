import { ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { LLMModel } from "@/shared/domain/settings";

export type LLMModelsListViewProps = {
    readonly search: string;
    readonly onSearchChange: (value: string) => void;
    readonly sortBy: string;
    readonly onSortChange: (value: string) => void;
    readonly activeFilters: readonly ActiveFilter[];
    readonly filterGroups: readonly FilterGroup[];
    readonly onToggleFilter?: (id: string) => void;
    readonly onRemoveFilter: (id: string) => void;
    readonly onClearAllFilters: () => void;
    readonly onApplyFilters: (selectedIds: string[]) => void;
    readonly onSelectionChange: (selectedIds: string[]) => void;
    readonly filteredModels: readonly LLMModel[];
    readonly previewCount: number;
    readonly isLoading: boolean;
    readonly isSyncingPricing: boolean;
    readonly onSyncAllVisible: () => void;
    readonly getProviderName: (providerId: string) => string;
    readonly onEditModel: (model: LLMModel) => void;
    readonly onDeleteModel: (id: string) => void;
    readonly selectedModel: LLMModel | null;
    readonly onSelectedModelChange: (modelId: string | null) => void;
    readonly deleteModalOpen: boolean;
    readonly onDeleteModalOpenChange: (open: boolean) => void;
    readonly onDeleteConfirm: () => void;
    readonly modelToDeleteName?: string;
    readonly affectedResources: readonly { id: string; name: string; role: string }[];
    readonly isLoadingUsage: boolean;
    readonly lastSyncedInfo: {
        newestSync: Date | null;
        errors: string[];
    } | null;
};
