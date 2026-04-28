import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { AutomationProviderSidePeek } from "./AutomationProviderSidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";

export interface AutomationProviderUI {
    id: string;
    title: string;
    platform: string;
    authType: string;
    baseUrl: string | undefined;
    categories: string[];
}

export interface AutomationProvidersBrowserViewProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    activeFilters: ActiveFilter[];
    filterGroups: readonly FilterGroup[];
    quickFilters: readonly QuickFilter[];
    sortOptions: readonly SortOption[];
    onToggleFilter: (id: string) => void;
    onRemoveFilter: (id: string) => void;
    onClearAllFilters: () => void;
    onApplyFilters: (ids: string[]) => void;
    onSelectionChange: (ids: string[]) => void;
    filteredProviders: AutomationProviderUI[];
    previewCount: number;
    isLoading: boolean;
    isError: boolean;
    selectedProvider: AutomationProviderUI | null;
    onProviderClick: (provider: AutomationProviderUI) => void;
    onConfigureProvider: (provider: AutomationProviderUI) => void;
    onDeleteProvider: (id: string) => void;
    onCloseSidePeek: () => void;
    deleteModalOpen: boolean;
    onCancelDelete: () => void;
    onConfirmDelete: () => void;
    providerToDeleteName?: string;
    affectedResources: any[];
}

export const AutomationProvidersBrowserView = ({
    searchQuery,
    onSearchChange,
    viewMode,
    setViewMode,
    sortBy,
    onSortChange,
    activeFilters,
    filterGroups,
    quickFilters,
    sortOptions,
    onToggleFilter,
    onRemoveFilter,
    onClearAllFilters,
    onApplyFilters,
    onSelectionChange,
    filteredProviders,
    previewCount,
    isLoading,
    isError,
    selectedProvider,
    onProviderClick,
    onConfigureProvider,
    onDeleteProvider,
    onCloseSidePeek,
    deleteModalOpen,
    onCancelDelete,
    onConfirmDelete,
    providerToDeleteName,
    affectedResources,
}: AutomationProvidersBrowserViewProps) => {
    return (
        <BrowserLayout
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder="Szukaj dostawców automatyzacji..."
            activeFilters={activeFilters.length > 0 && (
                <FilterBar 
                    activeFilters={activeFilters}
                    onRemove={onRemoveFilter}
                    onClearAll={onClearAllFilters}
                />
            )}
            actionBar={
                <ActionBar 
                    filterGroups={filterGroups}
                    activeFilters={activeFilters}
                    quickFilters={quickFilters}
                    onToggleFilter={onToggleFilter}
                    onApplyFilters={onApplyFilters} 
                    onClearAllFilters={onClearAllFilters}
                    onPendingFilterIdsChange={onSelectionChange}
                    resultsCount={previewCount}
                    sortOptions={sortOptions}
                    sortBy={sortBy}
                    onSortChange={onSortChange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />
            }
        >
            <ResourceList
                items={filteredProviders}
                isLoading={isLoading}
                isError={isError}
                viewMode={viewMode}
                renderItem={(provider) => (
                    <ResourceCard
                        key={provider.id}
                        title={provider.title}
                        description={provider.baseUrl || "Brak Base URL"}
                        href="#"
                        onClick={() => onProviderClick(provider)}
                        categories={provider.categories}
                        onEdit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onConfigureProvider(provider);
                        }}
                        onDelete={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteProvider(provider.id);
                        }}
                    />
                )}
            />

            <AutomationProviderSidePeek 
                provider={selectedProvider}
                isOpen={!!selectedProvider}
                onClose={onCloseSidePeek}
                onConfigure={onConfigureProvider}
                onDelete={onDeleteProvider}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={onCancelDelete}
                onConfirm={onConfirmDelete}
                title="Usuń Dostawcę Automatyzacji"
                resourceName={providerToDeleteName || "Dostawca"}
                affectedResources={affectedResources}
            />
        </BrowserLayout>
    );
};
