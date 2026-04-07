import React from "react";
import { Database } from "lucide-react";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { VectorDatabaseSidePeek } from "./VectorDatabaseSidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { VectorDatabasesListViewProps } from "./VectorDatabasesListView.types";

export const VectorDatabasesListView = ({
    search,
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
    displayItems,
    previewCount,
    isLoading,
    onDbClick,
    onEditDb,
    onDeleteDb,
    selectedDb,
    deleteModalOpen,
    onCancelDelete,
    onConfirmDelete,
    dbToDeleteName,
    onCloseSidePeek,
}: VectorDatabasesListViewProps) => {
    return (
        <>
            <BrowserLayout
                searchQuery={search}
                onSearchChange={onSearchChange}
                searchPlaceholder="Search databases..."
                activeFilters={activeFilters.length > 0 && (
                    <FilterBar
                        activeFilters={activeFilters as any}
                        onRemove={onRemoveFilter as any}
                        onClearAll={onClearAllFilters}
                    />
                )}
                actionBar={
                    <ActionBar
                        filterGroups={filterGroups as any}
                        activeFilters={activeFilters as any}
                        quickFilters={quickFilters as any}
                        onToggleFilter={onToggleFilter}
                        onApplyFilters={onApplyFilters}
                        onSelectionChange={onSelectionChange}
                        onClearAllFilters={onClearAllFilters}
                        onPendingFilterIdsChange={onSelectionChange}
                        resultsCount={previewCount}
                        sortOptions={sortOptions as any}
                        sortBy={sortBy}
                        onSortChange={onSortChange}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />
                }
            >
                <ResourceList
                    items={displayItems}
                    isLoading={isLoading}
                    viewMode={viewMode}
                    renderItem={(db) => (
                        <ResourceCard
                            key={db.id}
                            title={db.title}
                            description={db.description}
                            href="#"
                            icon={Database}
                            categories={db.categories}
                            onClick={() => onDbClick(db)}
                            onEdit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEditDb(db.id);
                            }}
                            onDelete={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeleteDb(db.id, db.title);
                            }}
                        />
                    )}
                />
            </BrowserLayout>

            <VectorDatabaseSidePeek 
                db={selectedDb}
                isOpen={!!selectedDb}
                onClose={onCloseSidePeek}
                onEdit={(db) => onEditDb(db.id)}
                onDelete={(id) => onDeleteDb(id, selectedDb?.vector_database_name)}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={onCancelDelete}
                onConfirm={onConfirmDelete}
                title="Usuń Bazę"
                resourceName={dbToDeleteName || "Baza"}
                affectedResources={[]}
            />
        </>
    );
};
