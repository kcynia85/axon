"use client";

import * as React from "react";
import { useChunkingStrategies, useDeleteChunkingStrategy } from "../application/useSettings";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import type { ChunkingStrategy } from "@/shared/domain/settings";
import { useChunkingStrategyDraft } from "@/modules/studio/features/chunking-studio/application/hooks/useChunkingStrategyDraft";
import { toast } from "sonner";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { useRouter } from "next/navigation";
import { ChunkingStrategiesListView } from "./ChunkingStrategiesListView";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";

const formatMethodName = (methodName: string) => {
    return methodName?.replace(/_/g, " ") || "Unknown";
};

const SORT_OPTIONS: readonly SortOption[] = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "size_desc", label: "Chunk Size (High-Low)" },
    { id: "size_asc", label: "Chunk Size (Low-High)" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
    { label: "Methods", groupId: "methods" },
];

/**
 * ChunkingStrategiesList: Main container for managing chunking strategies.
 * Standard: Container pattern, Readable naming, No abbreviations.
 */
export const ChunkingStrategiesList = () => {
    const { data: chunkingStrategies, isLoading } = useChunkingStrategies();
    const { mutateAsync: deleteChunkingStrategy } = useDeleteChunkingStrategy();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const router = useRouter();

    const { draft: newDraft, clearDraft: clearNewDraft } = useChunkingStrategyDraft("new");

    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [selectedStrategy, setSelectedStrategy] = React.useState<ChunkingStrategy | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [strategyToDelete, setStrategyToDelete] = React.useState<{ id: string; name: string } | null>(null);

    const getFilterGroups = (): FilterGroup[] => {
        if (!chunkingStrategies) return [];
        const uniqueMethods = Array.from(new Set(chunkingStrategies.map(strategy => strategy.strategy_chunking_method))).sort();
        return [
            {
                id: "methods",
                title: "Methods",
                type: "checkbox",
                options: uniqueMethods.map(methodName => ({
                    id: methodName,
                    label: formatMethodName(methodName),
                    isChecked: pendingFilterIds.includes(methodName)
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

    const handleToggleFilter = (filterId: string) => {
        const selectedOption = getFilterGroups()
            .flatMap(group => group.options.map(option => ({...option, groupId: group.id})))
            .find(option => option.id === filterId);

        if (selectedOption) {
            if (activeFilters.some(filter => filter.id === filterId)) {
                setActiveFilters(previousFilters => previousFilters.filter(filter => filter.id !== filterId));
                setPendingFilterIds(previousPendingIds => previousPendingIds.filter(pendingId => pendingId !== filterId));
            } else {
                setActiveFilters([...activeFilters, { id: selectedOption.id, label: selectedOption.label, category: selectedOption.groupId }]);
                setPendingFilterIds([...pendingFilterIds, filterId]);
            }
        }
    };

    const confirmDelete = (id: string, name: string) => {
        setStrategyToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleDeleteExecution = () => {
        if (strategyToDelete) {
            deleteWithUndo(strategyToDelete.id, strategyToDelete.name, () => deleteChunkingStrategy(strategyToDelete.id));
            setDeleteModalOpen(false);
            setStrategyToDelete(null);
        }
    };

    const handleDiscardDraft = (event: React.MouseEvent) => {
        event.stopPropagation();
        clearNewDraft();
        toast.success("Szkic odrzucony");
    };

    const getDisplayStrategies = () => {
        const baseStrategies = chunkingStrategies || [];
        const filtered = baseStrategies
            .filter(strategy => !pendingIds.has(strategy.id))
            .filter(strategy => {
                const matchesSearch = strategy.strategy_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    strategy.strategy_chunking_method.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
                const selectedMethodIds = activeFilters.filter(filter => filter.category === "methods").map(filter => filter.id);
                if (selectedMethodIds.length > 0) {
                    if (!selectedMethodIds.includes(strategy.strategy_chunking_method)) return false;
                }
                return true;
            });

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name_asc": return a.strategy_name.localeCompare(b.strategy_name);
                case "name_desc": return b.strategy_name.localeCompare(a.strategy_name);
                case "size_desc": return b.strategy_chunk_size - a.strategy_chunk_size;
                case "size_asc": return a.strategy_chunk_size - b.strategy_chunk_size;
                default: return 0;
            }
        }).map(strategy => {
            const isSemantic = strategy.strategy_chunking_method === "Semantic";
            return {
                ...strategy,
                title: strategy.strategy_name,
                description: formatMethodName(strategy.strategy_chunking_method),
                categories: [`Size: ${strategy.strategy_chunk_size}`, !isSemantic ? `Overlap: ${strategy.strategy_chunk_overlap}` : "Semantic"],
                isModified: false 
            };
        });
    };

    return (
        <ChunkingStrategiesListView
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
            onRemoveFilter={(id) => setActiveFilters(previousFilters => previousFilters.filter(filter => filter.id !== id))}
            onClearAllFilters={() => { setActiveFilters([]); setPendingFilterIds([]); }}
            onApplyFilters={handleApplyFilters}
            onSelectionChange={setPendingFilterIds}
            displayStrategies={getDisplayStrategies()}
            previewCount={getDisplayStrategies().length}
            isLoading={isLoading}
            newDraft={newDraft}
            onDiscardDraft={handleDiscardDraft}
            onNewDraftClick={() => router.push("/settings/knowledge-engine/chunking/new")}
            onStrategyClick={setSelectedStrategy}
            onEditStrategy={(id) => router.push(`/settings/knowledge-engine/chunking/${id}`)}
            onDeleteStrategy={confirmDelete}
            selectedStrategy={selectedStrategy}
            setSelectedStrategy={setSelectedStrategy}
            deleteModalOpen={deleteModalOpen}
            onDeleteModalOpenChange={setDeleteModalOpen}
            strategyToDeleteName={strategyToDelete?.name}
            onDeleteExecution={handleDeleteExecution}
        />
    );
};
