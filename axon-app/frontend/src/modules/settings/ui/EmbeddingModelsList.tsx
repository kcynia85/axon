"use client";

import * as React from "react";
import { useEmbeddingModels, useDeleteEmbeddingModel } from "../application/useSettings";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { useRouter } from "next/navigation";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { useEmbeddingModelDraft } from "@/modules/studio/features/embedding-studio/application/hooks/useEmbeddingModelDraft";
import { toast } from "sonner";
import { EmbeddingModelsListView } from "./EmbeddingModelsListView";
import { DisplayEmbeddingModel } from "./EmbeddingModelsListView.types";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";

const SORT_OPTIONS: readonly SortOption[] = [
    { id: "name_asc", label: "Identifier (A-Z)" },
    { id: "name_desc", label: "Identifier (Z-A)" },
    { id: "provider", label: "Provider" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
    { label: "Providers", groupId: "providers" },
];

const STATIC_CAPABILITIES = [
    { id: "text", label: "Text" },
    { id: "multimodal", label: "Multimodal" },
];

/**
 * EmbeddingModelsList: Main container for managing and listing embedding models.
 * Standard: Container pattern, Readable naming, No abbreviations.
 */
export const EmbeddingModelsList = () => {
    const { data: embeddingModels, isLoading } = useEmbeddingModels();
    const { mutateAsync: deleteEmbeddingModel } = useDeleteEmbeddingModel();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const router = useRouter();
    
    const { draft: newDraft, clearDraft: clearNewDraft } = useEmbeddingModelDraft("new");

    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [selectedModel, setSelectedModel] = React.useState<DisplayEmbeddingModel | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [modelToDelete, setModelToDelete] = React.useState<{ id: string; name: string } | null>(null);

    const getFilterGroups = (): FilterGroup[] => {
        if (!embeddingModels) return [];
        const providers = Array.from(new Set(embeddingModels.map(model => model.model_provider_name))).sort();
        return [
            {
                id: "capabilities",
                title: "Capabilities",
                type: "checkbox",
                options: STATIC_CAPABILITIES.map(capability => ({
                    id: capability.id,
                    label: capability.label,
                    isChecked: pendingFilterIds.includes(capability.id)
                }))
            },
            {
                id: "providers",
                title: "Providers",
                type: "checkbox",
                options: providers.map(provider => ({
                    id: provider,
                    label: provider,
                    isChecked: pendingFilterIds.includes(provider)
                }))
            }
        ];
    };

    const handleApplyFilters = (selectedIds: string[]) => {
        const nextFilters: ActiveFilter[] = [];
        getFilterGroups().forEach(group => {
            group.options.forEach(option => {
                if (selectedIds.includes(option.id)) {
                    nextFilters.push({ id: option.id, label: option.label, category: group.id });
                }
            });
        });
        setActiveFilters(nextFilters);
        setPendingFilterIds(selectedIds);
    };

    const handleToggleFilter = (id: string) => {
        const selectedOption = getFilterGroups()
            .flatMap(group => group.options.map(option => ({...option, groupId: group.id})))
            .find(option => option.id === id);

        if (selectedOption) {
            if (activeFilters.some(filter => filter.id === id)) {
                setActiveFilters(previousFilters => previousFilters.filter(filter => filter.id !== id));
                setPendingFilterIds(previousPendingIds => previousPendingIds.filter(pendingId => pendingId !== id));
            } else {
                setActiveFilters([...activeFilters, { id: selectedOption.id, label: selectedOption.label, category: selectedOption.groupId }]);
                setPendingFilterIds([...pendingFilterIds, id]);
            }
        }
    };

    const confirmDelete = (id: string, name: string) => {
        setModelToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleDeleteExecution = () => {
        if (modelToDelete) {
            deleteWithUndo(modelToDelete.id, modelToDelete.name, () => deleteEmbeddingModel(modelToDelete.id));
            setDeleteModalOpen(false);
            setModelToDelete(null);
        }
    };

    const handleDiscardDraft = (event: React.MouseEvent) => {
        event.stopPropagation();
        clearNewDraft();
        toast.success("Szkic odrzucony");
    };

    const getDisplayModels = () => {
        const baseModels = embeddingModels || [];
        const filtered = baseModels
            .filter(model => !pendingIds.has(model.id))
            .filter(model => {
                const matchesSearch = model.model_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    model.model_provider_name.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;

                const selectedCapabilityIds = activeFilters.filter(filter => filter.category === "capabilities").map(filter => filter.id);
                const selectedProviderIds = activeFilters.filter(filter => filter.category === "providers").map(filter => filter.id);

                if (selectedCapabilityIds.length > 0) {
                    const isMultimodal = model.model_id.toLowerCase().includes("multimodal") || model.model_id.toLowerCase().includes("vision");
                    const modelCapability = isMultimodal ? "multimodal" : "text";
                    if (!selectedCapabilityIds.includes(modelCapability)) return false;
                }

                if (selectedProviderIds.length > 0) {
                    if (!selectedProviderIds.includes(model.model_provider_name)) return false;
                }

                return true;
            });

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name_asc": return a.model_id.localeCompare(b.model_id);
                case "name_desc": return b.model_id.localeCompare(a.model_id);
                case "provider": return a.model_provider_name.localeCompare(b.model_provider_name);
                default: return 0;
            }
        }).map(model => {
            const isMultimodal = model.model_id.toLowerCase().includes("multimodal") || model.model_id.toLowerCase().includes("vision");
            return {
                ...model,
                title: model.model_id,
                description: model.model_provider_name,
                categories: [isMultimodal ? "Multimodal" : "Text"],
                isDraft: model.is_draft
            };
        });
    };

    const displayModels = getDisplayModels();

    return (
        <EmbeddingModelsListView
            search={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilters={activeFilters}
            filterGroups={getFilterGroups()}
            quickFilters={QUICK_FILTERS}
            sortOptions={SORT_OPTIONS}
            onToggleFilter={handleToggleFilter}
            onRemoveFilter={(id) => setActiveFilters(previous => previous.filter(filter => filter.id !== id))}
            onClearAllFilters={() => { setActiveFilters([]); setPendingFilterIds([]); }}
            onApplyFilters={handleApplyFilters}
            onSelectionChange={setPendingFilterIds}
            displayModels={displayModels}
            previewCount={displayModels.length}
            isLoading={isLoading}
            newDraft={newDraft}
            onDiscardDraft={handleDiscardDraft}
            onNewDraftClick={() => router.push("/settings/knowledge-engine/embedding/new")}
            onModelClick={setSelectedModel}
            onEditModel={(id) => router.push(`/settings/knowledge-engine/embedding/${id}`)}
            onDeleteModel={confirmDelete}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            deleteModalOpen={deleteModalOpen}
            setDeleteModalOpen={setDeleteModalOpen}
            modelToDelete={modelToDelete}
            onDeleteExecution={handleDeleteExecution}
        />
    );
};
