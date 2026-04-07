import React from "react";
import { Scissors } from "lucide-react";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { ChunkingStrategySidePeek } from "./ChunkingStrategySidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { ChunkingStrategiesListViewProps } from "./ChunkingStrategiesListView.types";

export const ChunkingStrategiesListView = ({
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
    displayStrategies,
    previewCount,
    isLoading,
    newDraft,
    onDiscardDraft,
    onNewDraftClick,
    onStrategyClick,
    onEditStrategy,
    onDeleteStrategy,
    selectedStrategy,
    setSelectedStrategy,
    deleteModalOpen,
    setDeleteModalOpen,
    strategyToDelete,
    onDeleteExecution,
}: ChunkingStrategiesListViewProps) => {
    return (
        <>
            <BrowserLayout
                searchQuery={search}
                onSearchChange={onSearchChange}
                searchPlaceholder="Search strategies..."
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
                    items={displayStrategies}
                    isLoading={isLoading}
                    viewMode={viewMode}
                    prependedItem={newDraft && (
                        <ResourceCard
                            title={newDraft.strategy_name || "Nowa Strategia (Szkic)"}
                            description={newDraft.strategy_chunking_method || "Nie wybrano metody"}
                            href="#"
                            isDraft={true}
                            badgeLabel="local draft"
                            icon={Scissors}
                            onClick={onNewDraftClick}
                            onDelete={onDiscardDraft}
                        />
                    )}
                    renderItem={(strategy) => (
                        <ResourceCard
                            key={strategy.id}
                            title={strategy.title}
                            description={strategy.description}
                            href="#"
                            icon={Scissors}
                            isDraft={strategy.is_draft}
                            badgeLabel={strategy.isModified ? "modified" : undefined}
                            categories={strategy.categories}
                            onClick={() => onStrategyClick(strategy)}
                            onEdit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEditStrategy(strategy.id);
                            }}
                            onDelete={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeleteStrategy(strategy.id, strategy.strategy_name);
                            }}
                        />
                    )}
                />
            </BrowserLayout>

            <ChunkingStrategySidePeek 
                strategy={selectedStrategy}
                isOpen={!!selectedStrategy}
                onClose={() => setSelectedStrategy(null)}
                onEdit={(strategy) => onEditStrategy(strategy.id)}
                onDelete={(id) => onDeleteStrategy(id, selectedStrategy?.strategy_name || "Strategy")}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={onDeleteExecution}
                title="Usuń Strategię"
                resourceName={strategyToDelete?.name || "Strategia"}
                affectedResources={[]}
            />
        </>
    );
};
