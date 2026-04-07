import React from "react";
import { Cpu } from "lucide-react";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { EmbeddingModelSidePeek } from "./EmbeddingModelSidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { EmbeddingModelsListViewProps } from "./EmbeddingModelsListView.types";

export const EmbeddingModelsListView = ({
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
    displayModels,
    previewCount,
    isLoading,
    newDraft,
    onDiscardDraft,
    onNewDraftClick,
    onModelClick,
    onEditModel,
    onDeleteModel,
    selectedModel,
    setSelectedModel,
    deleteModalOpen,
    setDeleteModalOpen,
    modelToDelete,
    onDeleteExecution,
}: EmbeddingModelsListViewProps) => {
    return (
        <>
            <BrowserLayout
                searchQuery={search}
                onSearchChange={onSearchChange}
                searchPlaceholder="Search models..."
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
                    items={displayModels}
                    isLoading={isLoading}
                    viewMode={viewMode}
                    prependedItem={newDraft && (
                        <ResourceCard
                            title={newDraft.model_id || "Nowy Model (Szkic)"}
                            description={newDraft.model_provider_name || "Nie wybrano dostawcy"}
                            href="#"
                            isDraft={true}
                            badgeLabel="SZKIC LOKALNY"
                            icon={Cpu}
                            onClick={onNewDraftClick}
                            onDelete={onDiscardDraft}
                        />
                    )}
                    renderItem={(model) => (
                        <ResourceCard
                            key={model.id}
                            title={model.title}
                            description={model.description}
                            href="#"
                            icon={Cpu}
                            isDraft={model.isDraft}
                            categories={model.categories}
                            onClick={() => onModelClick(model)}
                            onEdit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEditModel(model.id);
                            }}
                            onDelete={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeleteModel(model.id, model.model_id);
                            }}
                        />
                    )}
                />
            </BrowserLayout>

            <EmbeddingModelSidePeek 
                model={selectedModel}
                isOpen={!!selectedModel}
                onClose={() => setSelectedModel(null)}
                onEdit={(model) => onEditModel(model.id)}
                onDelete={(id) => onDeleteModel(id, selectedModel?.model_id)}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={onDeleteExecution}
                title="Usuń Model"
                resourceName={modelToDelete?.name || "Model"}
                affectedResources={[]}
            />
        </>
    );
};
