import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { LLMRouterSidePeek } from "./LLMRouterSidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { LLMRoutersBrowserViewProps } from "./LLMRoutersBrowserView.types";
import { Network } from "lucide-react";

export const LLMRoutersBrowserView = ({
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
    filteredRouters,
    previewCount,
    isLoading,
    isError,
    selectedRouter,
    onRouterClick,
    onConfigureRouter,
    onDeleteRouter,
    onCloseSidePeek,
    deleteModalOpen,
    onCancelDelete,
    onConfirmDelete,
    routerToDeleteName,
}: LLMRoutersBrowserViewProps) => {
    return (
        <BrowserLayout
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder="Szukaj routerów..."
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
                items={filteredRouters}
                isLoading={isLoading}
                isError={isError}
                viewMode={viewMode}
                renderItem={(router) => (
                    <ResourceCard
                        key={router.id}
                        title={router.title}
                        description={router.description}
                        href="#"
                        icon={Network}
                        onClick={() => onRouterClick(router)}
                        categories={router.categories}
                        onEdit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onConfigureRouter(router);
                        }}
                        onDelete={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteRouter(router.id);
                        }}
                    />
                )}
            />

            <LLMRouterSidePeek 
                router={selectedRouter}
                isOpen={!!selectedRouter}
                onClose={onCloseSidePeek}
                onEdit={() => selectedRouter && onConfigureRouter(selectedRouter)}
                onDelete={() => selectedRouter && onDeleteRouter(selectedRouter.id)}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={onCancelDelete}
                onConfirm={onConfirmDelete}
                title="Usuń Router"
                resourceName={routerToDeleteName || "Router"}
                affectedResources={[]}
            />
        </BrowserLayout>
    );
};
