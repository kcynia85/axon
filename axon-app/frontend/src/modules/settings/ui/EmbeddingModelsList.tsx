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

export const EmbeddingModelsList = () => {
    const { data: models, isLoading } = useEmbeddingModels();
    const { mutateAsync: deleteModel } = useDeleteEmbeddingModel();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const router = useRouter();
    
    const { draft: newDraft, clearDraft: clearNewDraft } = useEmbeddingModelDraft("new");

    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [selectedModel, setSelectedModel] = React.useState<DisplayEmbeddingModel | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [modelToDelete, setModelToDelete] = React.useState<{ id: string; name: string } | null>(null);

    const handleApplyFilters = (selectedIds: string[]) => {
        const nextFilters: ActiveFilter[] = [];
        getFilterGroups().forEach(group => {
            group.options.forEach(opt => {
                if (selectedIds.includes(opt.id)) {
                    nextFilters.push({ id: opt.id, label: opt.label, category: group.id });
                }
            });
        });
        setActiveFilters(nextFilters);
        setPendingFilterIds(selectedIds);
    };

    const handleToggleFilter = (id: string) => {
        const option = getFilterGroups().flatMap(g => g.options.map(o => ({...o, groupId: g.id}))).find(o => o.id === id);
        if (option) {
            if (activeFilters.some(f => f.id === id)) {
                setActiveFilters(prev => prev.filter(f => f.id !== id));
                setPendingFilterIds(prev => prev.filter(pId => pId !== id));
            } else {
                setActiveFilters([...activeFilters, { id: option.id, label: option.label, category: option.groupId }]);
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
            deleteWithUndo(modelToDelete.id, modelToDelete.name, () => deleteModel(modelToDelete.id));
            setDeleteModalOpen(false);
            setModelToDelete(null);
        }
    };

    const handleDiscardDraft = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearNewDraft();
        toast.success("Szkic odrzucony");
    };

    const getFilterGroups = (): FilterGroup[] => {
        if (!models) return [];
        const providers = Array.from(new Set(models.map(m => m.model_provider_name))).sort();
        return [
            {
                id: "capabilities",
                title: "Capabilities",
                type: "checkbox",
                options: STATIC_CAPABILITIES.map(c => ({
                    id: c.id,
                    label: c.label,
                    isChecked: pendingFilterIds.includes(c.id)
                }))
            },
            {
                id: "providers",
                title: "Providers",
                type: "checkbox",
                options: providers.map(p => ({
                    id: p,
                    label: p,
                    isChecked: pendingFilterIds.includes(p)
                }))
            }
        ];
    };

    const getDisplayModels = () => {
        const baseModels = models || [];
        const filtered = baseModels
            .filter(model => !pendingIds.has(model.id))
            .filter(model => {
                const matchesSearch = model.model_id.toLowerCase().includes(search.toLowerCase()) ||
                    model.model_provider_name.toLowerCase().includes(search.toLowerCase());
                if (!matchesSearch) return false;

                const selectedCapabilityIds = activeFilters.filter(f => f.category === "capabilities").map(f => f.id);
                const selectedProviderIds = activeFilters.filter(f => f.category === "providers").map(f => f.id);

                if (selectedCapabilityIds.length > 0) {
                    const isMultimodal = model.model_id.toLowerCase().includes("multimodal") || model.model_id.toLowerCase().includes("vision");
                    const modelCap = isMultimodal ? "multimodal" : "text";
                    if (!selectedCapabilityIds.includes(modelCap)) return false;
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
            search={search}
            onSearchChange={setSearch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilters={activeFilters}
            filterGroups={getFilterGroups()}
            quickFilters={QUICK_FILTERS}
            sortOptions={SORT_OPTIONS}
            onToggleFilter={handleToggleFilter}
            onRemoveFilter={(id) => setActiveFilters(prev => prev.filter(f => f.id !== id))}
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
