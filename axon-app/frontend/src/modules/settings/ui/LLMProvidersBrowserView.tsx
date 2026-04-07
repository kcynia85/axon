import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { LLMProviderSidePeek } from "./LLMProviderSidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { LLMProvidersBrowserViewProps } from "./LLMProvidersBrowserView.types";

export const LLMProvidersBrowserView = ({
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
}: LLMProvidersBrowserViewProps) => {
    return (
        <BrowserLayout
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder="Szukaj dostawców..."
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
                    onSelectionChange={onSelectionChange}
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
                        description={null}
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

            <LLMProviderSidePeek 
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
                title="Usuń Dostawcę"
                resourceName={providerToDeleteName || "Dostawca"}
                affectedResources={affectedResources}
            />
        </BrowserLayout>
    );
};
