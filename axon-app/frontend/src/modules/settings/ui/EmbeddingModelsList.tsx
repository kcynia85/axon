"use client";

import * as React from "react";
import { useEmbeddingModels, useDeleteEmbeddingModel } from "../application/useSettings";
import { Cpu, Trash2 } from "lucide-react";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { EmbeddingModelSidePeek } from "./EmbeddingModelSidePeek";
import { useRouter } from "next/navigation";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { useEmbeddingModelDraft } from "@/modules/studio/features/embedding-studio/application/hooks/useEmbeddingModelDraft";
import { toast } from "sonner";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";

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
    
    // Local Drafts (Workspace Pattern)
    const { draft: newDraft, clearDraft: clearNewDraft } = useEmbeddingModelDraft("new");

    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [selectedModel, setSelectedModel] = React.useState<any | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);

    // Deletion Modal State
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [modelToDelete, setModelToDelete] = React.useState<{ id: string; name: string } | null>(null);

    const filterGroups = React.useMemo(() => {
        if (!models) return [];
        
        const providers = Array.from(new Set(models.map(m => m.model_provider_name))).sort();
        
        const groups: FilterGroup[] = [
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
        return groups;
    }, [models, pendingFilterIds]);

    const filteredModels = React.useMemo(() => {
        const baseModels = models || [];
        
        const filtered = baseModels
            .filter(model => !pendingIds.has(model.id))
            .filter(model => {
                // Search
                const matchesSearch = model.model_id.toLowerCase().includes(search.toLowerCase()) ||
                    model.model_provider_name.toLowerCase().includes(search.toLowerCase());
                if (!matchesSearch) return false;

                // Filters
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
                case "name_asc":
                    return a.model_id.localeCompare(b.model_id);
                case "name_desc":
                    return b.model_id.localeCompare(a.model_id);
                case "provider":
                    return a.model_provider_name.localeCompare(b.model_provider_name);
                default:
                    return 0;
            }
        });
    }, [models, search, sortBy, pendingIds, activeFilters]);

    const previewCount = React.useMemo(() => {
        const baseModels = models || [];
        return baseModels.filter(model => {
            if (pendingIds.has(model.id)) return false;
            
            const matchesSearch = model.model_id.toLowerCase().includes(search.toLowerCase()) ||
                model.model_provider_name.toLowerCase().includes(search.toLowerCase());
            if (!matchesSearch) return false;

            const selectedCapabilityIds = pendingFilterIds.filter(id => STATIC_CAPABILITIES.some(c => c.id === id));
            const selectedProviderIds = pendingFilterIds.filter(id => !STATIC_CAPABILITIES.some(c => c.id === id));

            if (selectedCapabilityIds.length > 0) {
                const isMultimodal = model.model_id.toLowerCase().includes("multimodal") || model.model_id.toLowerCase().includes("vision");
                const modelCap = isMultimodal ? "multimodal" : "text";
                if (!selectedCapabilityIds.includes(modelCap)) return false;
            }

            if (selectedProviderIds.length > 0) {
                if (!selectedProviderIds.includes(model.model_provider_name)) return false;
            }

            return true;
        }).length;
    }, [models, search, pendingFilterIds, pendingIds]);

    const handleApplyFilters = (selectedIds: string[]) => {
        const nextFilters: ActiveFilter[] = [];
        filterGroups.forEach(group => {
            group.options.forEach(opt => {
                if (selectedIds.includes(opt.id)) {
                    nextFilters.push({ id: opt.id, label: opt.label, category: group.id });
                }
            });
        });
        setActiveFilters(nextFilters);
        setPendingFilterIds(selectedIds);
    };

    const handleSelectionChange = (selectedIds: string[]) => {
        setPendingFilterIds(selectedIds);
    };

    const handleToggleFilter = (id: string) => {
        const option = filterGroups.flatMap(g => g.options.map(o => ({...o, groupId: g.id}))).find(o => o.id === id);
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

    const handleRemoveFilter = (id: string) => {
        setActiveFilters(prev => prev.filter(f => f.id !== id));
        setPendingFilterIds(prev => prev.filter(pId => pId !== id));
    };

    const handleClearAll = () => {
        setActiveFilters([]);
        setPendingFilterIds([]);
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

    const displayModels = filteredModels.map(model => {
        const isMultimodal = model.model_id.toLowerCase().includes("multimodal") || model.model_id.toLowerCase().includes("vision");
        return {
            ...model,
            title: model.model_id,
            description: model.model_provider_name,
            categories: [isMultimodal ? "Multimodal" : "Text"],
            isDraft: model.is_draft
        };
    });

    return (
        <>
            <BrowserLayout
                searchQuery={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search models..."
                activeFilters={activeFilters.length > 0 && (
                    <FilterBar
                        activeFilters={activeFilters}
                        onRemove={handleRemoveFilter}
                        onClearAll={handleClearAll}
                    />
                )}
                actionBar={
                    <ActionBar
                        filterGroups={filterGroups}
                        activeFilters={activeFilters}
                        quickFilters={QUICK_FILTERS}
                        onToggleFilter={handleToggleFilter}
                        onApplyFilters={handleApplyFilters}
                        onSelectionChange={handleSelectionChange}
                        onClearAllFilters={handleClearAll}
                        onPendingFilterIdsChange={handleSelectionChange}
                        resultsCount={previewCount}
                        sortOptions={SORT_OPTIONS}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
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
                            onClick={() => router.push("/settings/knowledge-engine/embedding/new")}
                            onDelete={handleDiscardDraft}
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
                            onClick={() => setSelectedModel(model)}
                            onEdit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/settings/knowledge-engine/embedding/${model.id}`);
                            }}
                            onDelete={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                confirmDelete(model.id, model.model_id);
                            }}
                        />
                    )}
                />
            </BrowserLayout>

            <EmbeddingModelSidePeek 
                model={selectedModel}
                isOpen={!!selectedModel}
                onClose={() => setSelectedModel(null)}
                onEdit={(model) => router.push(`/settings/knowledge-engine/embedding/${model.id}`)}
                onDelete={(id) => confirmDelete(id, selectedModel?.model_id)}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteExecution}
                title="Usuń Model"
                resourceName={modelToDelete?.name || "Model"}
                affectedResources={[]} // Optional: add affiliations if known
            />
        </>
    );
};
