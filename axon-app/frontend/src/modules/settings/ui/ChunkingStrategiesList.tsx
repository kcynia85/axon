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

const formatMethodName = (method: string) => {
    return method?.replace(/_/g, " ") || "Unknown";
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

export const ChunkingStrategiesList = () => {
    const { data: strategies, isLoading } = useChunkingStrategies();
    const { mutateAsync: deleteStrategy } = useDeleteChunkingStrategy();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const router = useRouter();

    const { draft: newDraft, clearDraft: clearNewDraft } = useChunkingStrategyDraft("new");

    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [selectedStrategy, setSelectedStrategy] = React.useState<ChunkingStrategy | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [strategyToDelete, setStrategyToDelete] = React.useState<{ id: string; name: string } | null>(null);

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
        setStrategyToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleDeleteExecution = () => {
        if (strategyToDelete) {
            deleteWithUndo(strategyToDelete.id, strategyToDelete.name, () => deleteStrategy(strategyToDelete.id));
            setDeleteModalOpen(false);
            setStrategyToDelete(null);
        }
    };

    const handleDiscardDraft = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearNewDraft();
        toast.success("Szkic odrzucony");
    };

    const getFilterGroups = (): FilterGroup[] => {
        if (!strategies) return [];
        const methods = Array.from(new Set(strategies.map(s => s.strategy_chunking_method))).sort();
        return [
            {
                id: "methods",
                title: "Methods",
                type: "checkbox",
                options: methods.map(m => ({
                    id: m,
                    label: formatMethodName(m),
                    isChecked: pendingFilterIds.includes(m)
                }))
            }
        ];
    };

    const getDisplayStrategies = () => {
        const baseStrategies = strategies || [];
        const filtered = baseStrategies
            .filter(strategy => !pendingIds.has(strategy.id))
            .filter(strategy => {
                const matchesSearch = strategy.strategy_name.toLowerCase().includes(search.toLowerCase()) ||
                    strategy.strategy_chunking_method.toLowerCase().includes(search.toLowerCase());
                if (!matchesSearch) return false;
                const selectedMethodIds = activeFilters.filter(f => f.category === "methods").map(f => f.id);
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
                isModified: false // In a real scenario, check for individual draft
            };
        });
    };

    return (
        <ChunkingStrategiesListView
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
            setDeleteModalOpen={setDeleteModalOpen}
            strategyToDelete={strategyToDelete}
            onDeleteExecution={handleDeleteExecution}
        />
    );
};
