"use client";

import * as React from "react";
import { useEmbeddingModels, useDeleteEmbeddingModel } from "../application/useSettings";
import { Card, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { CategoryChip } from "@/shared/ui/ui/CategoryChip";
import { Search, ArrowUpDown, Cpu, Filter, Plus, Trash2 } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { Badge } from "@/shared/ui/ui/Badge";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { EmbeddingModelSidePeek } from "./EmbeddingModelSidePeek";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { FilterGroup, ActiveFilter } from "@/shared/domain/filters";
import { useEmbeddingModelDraft } from "@/modules/studio/features/embedding-studio/application/hooks/useEmbeddingModelDraft";
import { toast } from "sonner";

const SORT_OPTIONS = [
    { id: "name_asc", label: "Identifier (A-Z)" },
    { id: "name_desc", label: "Identifier (Z-A)" },
    { id: "provider", label: "Provider" },
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
    const [selectedModel, setSelectedModel] = React.useState<any | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);

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

    const handleDelete = (id: string, name: string) => {
        deleteWithUndo(id, name, () => deleteModel(id));
        setSelectedModel(null);
    };

    const handleDiscardDraft = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Czy na pewno chcesz odrzucić ten szkic?")) {
            clearNewDraft();
            toast.success("Szkic odrzucony");
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-[52px] flex-1 max-w-sm rounded-md" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full rounded-xl" />)}
                </div>
            </div>
        );
    }

    const displayModels = filteredModels.length > 0 || search || activeFilters.length > 0 ? filteredModels : [
        {
            id: "mock-1",
            model_provider_name: "OpenAI",
            model_id: "text-embedding-3-small",
            model_vector_dimensions: 1536,
            model_max_context_tokens: 8191,
            model_cost_per_1m_tokens: 0.02,
        },
        {
            id: "mock-2",
            model_provider_name: "Google",
            model_id: "gemini-embedding-001",
            model_vector_dimensions: 768,
            model_max_context_tokens: 8191,
            model_cost_per_1m_tokens: 0.02,
        },
        {
            id: "mock-3",
            model_provider_name: "Google",
            model_id: "multimodalembedding@001",
            model_vector_dimensions: 1408,
            model_max_context_tokens: 8191,
            model_cost_per_1m_tokens: 0.05,
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-8 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <Input
                            placeholder="Search models..."
                            className="pl-10 h-[52px] text-xs border-zinc-200 dark:border-zinc-800"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6 h-9">
                        <FilterBigMenu
                            groups={filterGroups}
                            resultsCount={previewCount}
                            onApply={handleApplyFilters}
                            onSelectionChange={handleSelectionChange}
                            onClearAll={() => { setActiveFilters([]); setPendingFilterIds([]); }}
                            trigger={
                                <div className={cn(
                                    "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent transition-all pb-1.5 cursor-pointer group outline-none translate-y-[2px]",
                                    activeFilters.length > 0 
                                        ? "text-black dark:text-white border-black dark:border-white" 
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white"
                                )}>
                                    <Filter size={14} className="group-hover:scale-110 transition-transform" />
                                    <span>Filters</span>
                                    {activeFilters.length > 0 && (
                                        <Badge variant="secondary" className="ml-0.5 h-4 min-w-4 px-1 rounded-full text-[9px] font-black bg-black dark:bg-white text-white dark:text-black">
                                            {activeFilters.length}
                                        </Badge>
                                    )}
                                </div>
                            }
                        />

                        <SortMenu 
                            options={SORT_OPTIONS}
                            activeOptionId={sortBy}
                            onSelect={(id) => setSortBy(id)}
                            trigger={
                                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-1.5 cursor-pointer group outline-none translate-y-[2px]">
                                    <ArrowUpDown size={14} className="group-hover:scale-110 transition-transform" />
                                    <span>Sort</span>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* NEW DRAFT GHOST CARD */}
                {newDraft && (
                    <Card 
                        className="group transition-all flex flex-col overflow-hidden border-2 border-dashed border-primary/20 bg-primary/5 hover:border-primary/40 cursor-pointer h-full relative"
                        onClick={() => router.push("/settings/knowledge-engine/embedding/new")}
                    >
                        <CardContent className="pt-1 pb-4 flex items-start gap-4">
                            <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary mt-4">
                                <Plus className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0 flex-1 pt-4">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="text-base font-bold tracking-tight truncate leading-none mt-0.5 text-primary/80">
                                        {newDraft.model_id || "Nowy Model (Szkic)"}
                                    </h3>
                                    <Badge variant="outline" className="text-[8px] h-4 px-1.5 font-black uppercase tracking-widest border-primary/30 bg-primary/10 text-primary">
                                        SZKIC LOKALNY
                                    </Badge>
                                </div>
                                <div className="text-xs font-medium text-primary/60">
                                    {newDraft.model_provider_name || "Nie wybrano dostawcy"}
                                </div>
                                <div className="pt-2">
                                    <CategoryChip label="Kliknij aby kontynuować" className="bg-primary/10 text-primary border-primary/20" />
                                </div>
                            </div>
                            <button 
                                onClick={handleDiscardDraft}
                                className="absolute top-2 right-2 p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </CardContent>
                    </Card>
                )}

                {displayModels.map((model) => {
                    const isMultimodal = model.model_id.toLowerCase().includes("multimodal") || model.model_id.toLowerCase().includes("vision");
                    
                    return (
                        <Card 
                            key={model.id} 
                            className="group hover:border-primary/50 transition-all flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md cursor-pointer h-full"
                            onClick={() => setSelectedModel(model)}
                        >
                            <CardContent className="pt-1 pb-4 flex items-start gap-4">
                                <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary mt-4">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-1 min-w-0 flex-1 pt-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-base font-bold tracking-tight truncate leading-none mt-0.5">{model.model_id}</h3>
                                        {model.is_draft && (
                                            <Badge variant="outline" className="text-[8px] h-4 px-1.5 font-black uppercase tracking-widest border-amber-500/20 bg-amber-500/5 text-amber-500">
                                                Szkic
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-xs font-medium text-zinc-400">
                                        {model.model_provider_name}
                                    </div>
                                    <div className="pt-2">
                                        <CategoryChip label={isMultimodal ? "Multimodal" : "Text"} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {displayModels.length === 0 && !newDraft && (
                    <div className="col-span-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 space-y-2">
                        <Cpu className="w-8 h-8 opacity-20" />
                        <span className="text-xs font-medium">No embedding models found</span>
                    </div>
                )}
            </div>

            <EmbeddingModelSidePeek 
                model={selectedModel}
                isOpen={!!selectedModel}
                onClose={() => setSelectedModel(null)}
                onEdit={(model) => router.push(`/settings/knowledge-engine/embedding/${model.id}`)}
                onDelete={(id) => handleDelete(id, selectedModel?.model_id)}
            />
        </div>
    );
};
