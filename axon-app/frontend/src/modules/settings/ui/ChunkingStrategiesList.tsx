"use client";

import * as React from "react";
import { useChunkingStrategies, useDeleteChunkingStrategy } from "../application/useSettings";
import { Scissors, Trash2 } from "lucide-react";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { ChunkingStrategySidePeek } from "./ChunkingStrategySidePeek";
import type { ChunkingStrategy } from "@/shared/domain/settings";
import { useChunkingStrategyDraft } from "@/modules/studio/features/chunking-studio/application/hooks/useChunkingStrategyDraft";
import { toast } from "sonner";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { useRouter } from "next/navigation";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";

const formatMethodName = (method: string) => {
    return method?.replace(/_/g, " ") || "Unknown";
};

// Inner component for individual strategy cards to handle their own draft hydration
const StrategyCard = ({ 
    strategy, 
    onClick, 
    onEdit, 
    onDelete 
}: { 
    strategy: ChunkingStrategy & { title: string; description: string; categories: string[]; isDraft: boolean }; 
    onClick: () => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}) => {
    const { draft } = useChunkingStrategyDraft(strategy.id);
    
    // Hydrate data from draft
    const displayData = {
        ...strategy,
        ...(draft || {})
    };
    
    const isModified = !!draft && Object.keys(draft).length > 0;
    const isSemantic = displayData.strategy_chunking_method === "Semantic" || displayData.strategy_chunking_method === "SEMANTIC";
    
    const categories = [
        `Size: ${displayData.strategy_chunk_size}`, 
        !isSemantic ? `Overlap: ${displayData.strategy_chunk_overlap}` : "Semantic"
    ];

    return (
        <ResourceCard
            title={displayData.strategy_name || strategy.title}
            description={formatMethodName(displayData.strategy_chunking_method)}
            href="#"
            icon={Scissors}
            isDraft={displayData.is_draft || strategy.isDraft || isModified}
            badgeLabel={isModified ? "modified" : undefined}
            categories={categories}
            onClick={onClick}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
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

    // Local Drafts (Workspace Pattern)
    const { draft: newDraft, clearDraft: clearNewDraft } = useChunkingStrategyDraft("new");

    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [selectedStrategy, setSelectedStrategy] = React.useState<ChunkingStrategy | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);

    // Deletion Modal State
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [strategyToDelete, setStrategyToDelete] = React.useState<{ id: string; name: string } | null>(null);

    const filterGroups = React.useMemo(() => {
        if (!strategies) return [];
        
        const methods = Array.from(new Set(strategies.map(s => s.strategy_chunking_method))).sort();
        
        const groups: FilterGroup[] = [
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
        return groups;
    }, [strategies, pendingFilterIds]);

    const filteredStrategies = React.useMemo(() => {
        const baseStrategies = strategies || [];
        
        const filtered = baseStrategies
            .filter(strategy => !pendingIds.has(strategy.id))
            .filter(strategy => {
                // Search
                const matchesSearch = strategy.strategy_name.toLowerCase().includes(search.toLowerCase()) ||
                    strategy.strategy_chunking_method.toLowerCase().includes(search.toLowerCase());
                if (!matchesSearch) return false;

                // Filters
                const selectedMethodIds = activeFilters.filter(f => f.category === "methods").map(f => f.id);

                if (selectedMethodIds.length > 0) {
                    if (!selectedMethodIds.includes(strategy.strategy_chunking_method)) return false;
                }

                return true;
            });

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name_asc":
                    return a.strategy_name.localeCompare(b.strategy_name);
                case "name_desc":
                    return b.strategy_name.localeCompare(a.strategy_name);
                case "size_desc":
                    return b.strategy_chunk_size - a.strategy_chunk_size;
                case "size_asc":
                    return a.strategy_chunk_size - b.strategy_chunk_size;
                default:
                    return 0;
            }
        });
    }, [strategies, search, sortBy, pendingIds, activeFilters]);

    const previewCount = React.useMemo(() => {
        const baseStrategies = strategies || [];
        return baseStrategies.filter(strategy => {
            if (pendingIds.has(strategy.id)) return false;
            
            const matchesSearch = strategy.strategy_name.toLowerCase().includes(search.toLowerCase()) ||
                strategy.strategy_chunking_method.toLowerCase().includes(search.toLowerCase());
            if (!matchesSearch) return false;

            const selectedMethodIds = pendingFilterIds;

            if (selectedMethodIds.length > 0) {
                if (!selectedMethodIds.includes(strategy.strategy_chunking_method)) return false;
            }

            return true;
        }).length;
    }, [strategies, search, pendingFilterIds, pendingIds]);

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

    const displayStrategies = filteredStrategies.map(strategy => {
        const isSemantic = strategy.strategy_chunking_method === "Semantic";
        return {
            ...strategy,
            title: strategy.strategy_name,
            description: formatMethodName(strategy.strategy_chunking_method),
            categories: [`Size: ${strategy.strategy_chunk_size}`, !isSemantic ? `Overlap: ${strategy.strategy_chunk_overlap}` : "Semantic"],
            isDraft: strategy.is_draft
        };
    });

    return (
        <>
            <BrowserLayout
                searchQuery={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search strategies..."
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
                    items={displayStrategies}
                    isLoading={isLoading}
                    viewMode={viewMode}
                    prependedItem={newDraft && (
                        <ResourceCard
                            title={newDraft.strategy_name || "Nowa Strategia (Szkic)"}
                            description={newDraft.strategy_chunking_method ? formatMethodName(newDraft.strategy_chunking_method) : "Nie wybrano metody"}
                            href="#"
                            isDraft={true}
                            badgeLabel="local draft"
                            icon={Scissors}
                            onClick={() => router.push("/settings/knowledge-engine/chunking/new")}
                            onDelete={handleDiscardDraft}
                        />
                    )}
                    renderItem={(strategy) => (
                        <StrategyCard
                            key={strategy.id}
                            strategy={strategy}
                            onClick={() => setSelectedStrategy(strategy)}
                            onEdit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/settings/knowledge-engine/chunking/${strategy.id}`);
                            }}
                            onDelete={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                confirmDelete(strategy.id, strategy.strategy_name);
                            }}
                        />
                    )}
                />
            </BrowserLayout>

            <ChunkingStrategySidePeek 
                strategy={selectedStrategy}
                isOpen={!!selectedStrategy}
                onClose={() => setSelectedStrategy(null)}
                onEdit={(strategy) => router.push(`/settings/knowledge-engine/chunking/${strategy.id}`)}
                onDelete={(id) => confirmDelete(id, selectedStrategy?.strategy_name || "Strategy")}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteExecution}
                title="Usuń Strategię"
                resourceName={strategyToDelete?.name || "Strategia"}
                affectedResources={[]}
            />
        </>
    );
};
