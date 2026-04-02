"use client";

import * as React from "react";
import { useLLMModels, useDeleteLLMModel } from "../application/useSettings";
import { useLLMProviders, useSyncProviderPricing } from "../application/useLLMProviders";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/ui/ui/Table";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/shared/ui/ui/DropdownMenu";
import { Button } from "@/shared/ui/ui/Button";
import { 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Search,
    Filter,
    Info,
    ArrowUpDown,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { cn } from "@/shared/lib/utils";
import { Tooltip } from "@/shared/ui/ui/Tooltip";
import { LLMModelSidePeek } from "./LLMModelSidePeek";
import type { LLMModel } from "@/shared/domain/settings";
import { useRouter } from "next/navigation";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { FilterGroup, ActiveFilter } from "@/shared/domain/filters";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { useLLMModelUsage } from "../application/useSettings";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { toast } from "sonner";

const STATIC_CAPABILITIES = [
    { id: "vision", label: "Vision" },
    { id: "streaming", label: "Streaming" },
    { id: "tools", label: "Tools" },
    { id: "json", label: "JSON Mode" },
    { id: "audio", label: "Audio" },
    { id: "thinking", label: "Thinking / Reasoning" },
];

const STATIC_TIERS = [
    { id: "Tier1", label: "Tier 1 (High-End)" },
    { id: "Tier2", label: "Tier 2 (Mid/Basic)" },
];

const SORT_OPTIONS = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "context_desc", label: "Context (Largest First)" },
    { id: "context_asc", label: "Context (Smallest First)" },
    { id: "price_in_asc", label: "Input Cost (Lowest First)" },
    { id: "price_out_asc", label: "Output Cost (Lowest First)" },
];

/**
 * LLMModelsList: Displays available LLM models in a table.
 */
export const LLMModelsList = () => {
    const router = useRouter();
    const { data: models, isLoading } = useLLMModels();
    const { data: providers } = useLLMProviders();
    const { mutateAsync: deleteModel } = useDeleteLLMModel();
    const { mutateAsync: syncPricing, isPending: isSyncingPricing } = useSyncProviderPricing();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    
    const [search, setSearch] = React.useState("");
    const [selectedModelId, setSelectedModelId] = React.useState<string | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);
    const [sortBy, setSortBy] = React.useState("name_asc");

    // Deletion Modal State
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [modelToDeleteId, setModelToDeleteId] = React.useState<string | null>(null);
    
    const { data: usageData, isLoading: isLoadingUsage } = useLLMModelUsage(modelToDeleteId || undefined);

    const modelToDelete = React.useMemo(() => {
        if (!modelToDeleteId || !models) return null;
        return models.find(m => m.id === modelToDeleteId) || null;
    }, [models, modelToDeleteId]);

    const affectedResources = React.useMemo(() => {
        if (!usageData?.used_by) return [];
        return usageData.used_by.map((name, index) => ({
            id: `usage-${index}`,
            name: name,
            role: "Assigned To"
        }));
    }, [usageData]);

    const filterGroups = React.useMemo(() => {
        const activeIds = activeFilters.map(f => f.id);
        
        const groups: FilterGroup[] = [];

        // 1. Providers Group
        if (providers) {
            groups.push({
                id: "providers",
                title: "Providers",
                type: "checkbox",
                options: providers.map(p => ({
                    id: p.id,
                    label: p.provider_name,
                    isChecked: activeIds.includes(p.id)
                }))
            });
        }

        // 2. Capabilities Group
        groups.push({
            id: "capabilities",
            title: "Capabilities",
            type: "checkbox",
            options: STATIC_CAPABILITIES.map(c => ({
                id: c.id,
                label: c.label,
                isChecked: activeIds.includes(c.id)
            }))
        });

        // 3. Tiers Group
        groups.push({
            id: "tiers",
            title: "Tiers",
            type: "checkbox",
            options: STATIC_TIERS.map(t => ({
                id: t.id,
                label: t.label,
                isChecked: activeIds.includes(t.id)
            }))
        });

        return groups;
    }, [providers, activeFilters]);

    const handleApplyFilters = (selectedIds: string[]) => {
        const nextFilters: ActiveFilter[] = [];
        
        filterGroups.forEach(group => {
            group.options.forEach(opt => {
                if (selectedIds.includes(opt.id)) {
                    nextFilters.push({
                        id: opt.id,
                        label: opt.label,
                        category: group.id
                    });
                }
            });
        });

        setActiveFilters(nextFilters);
        setPendingFilterIds(selectedIds);
    };

    const handleSelectionChange = (selectedIds: string[]) => {
        setPendingFilterIds(selectedIds);
    };

    const handleRemoveFilter = (filterId: string) => {
        setActiveFilters(prev => prev.filter(f => f.id !== filterId));
        setPendingFilterIds(prev => prev.filter(id => id !== filterId));
    };

    const selectedModel = React.useMemo(() => {
        if (!selectedModelId || !models) return null;
        return models.find(m => m.id === selectedModelId) || null;
    }, [models, selectedModelId]);

    const previewCount = React.useMemo(() => {
        if (!models) return 0;

        return models.filter(m => {
            if (pendingIds.has(m.id)) return false;

            const matchesSearch = 
                m.model_display_name.toLowerCase().includes(search.toLowerCase()) ||
                m.model_id.toLowerCase().includes(search.toLowerCase());
            
            if (!matchesSearch) return false;

            if (pendingFilterIds.length === 0) return true;

            const selectedProviderIds = pendingFilterIds.filter(id => providers?.some(p => p.id === id));
            const selectedCapabilityIds = pendingFilterIds.filter(id => STATIC_CAPABILITIES.some(c => c.id === id));
            const selectedTierIds = pendingFilterIds.filter(id => STATIC_TIERS.some(t => t.id === id));

            if (selectedProviderIds.length > 0 && !selectedProviderIds.includes(m.llm_provider_id)) return false;
            if (selectedCapabilityIds.length > 0 && !selectedCapabilityIds.every(id => m.model_capabilities_flags?.includes(id))) return false;
            if (selectedTierIds.length > 0) {
                const modelTier = m.model_tier.toUpperCase();
                if (!selectedTierIds.some(id => id.toUpperCase() === modelTier)) return false;
            }

            return true;
        }).length;
    }, [models, search, pendingFilterIds, pendingIds, providers]);

    const filteredModels = React.useMemo(() => {
        if (!models) return [];

        const filtered = models
            .filter(m => !pendingIds.has(m.id))
            .filter(m => {
                // 1. Search Filter
                const matchesSearch = 
                    m.model_display_name.toLowerCase().includes(search.toLowerCase()) ||
                    m.model_id.toLowerCase().includes(search.toLowerCase());
                
                if (!matchesSearch) return false;

                // 2. Category Filters
                const selectedProviderIds = activeFilters.filter(f => f.category === "providers").map(f => f.id);
                const selectedCapabilityIds = activeFilters.filter(f => f.category === "capabilities").map(f => f.id);
                const selectedTierIds = activeFilters.filter(f => f.category === "tiers").map(f => f.id);

                // Providers (OR)
                if (selectedProviderIds.length > 0 && !selectedProviderIds.includes(m.llm_provider_id)) {
                    return false;
                }

                // Capabilities (AND)
                if (selectedCapabilityIds.length > 0) {
                    const hasAllCapabilities = selectedCapabilityIds.every(id => 
                        m.model_capabilities_flags?.includes(id)
                    );
                    if (!hasAllCapabilities) return false;
                }

                // Tiers (OR)
                if (selectedTierIds.length > 0) {
                    const modelTier = m.model_tier.toUpperCase();
                    const matchesTier = selectedTierIds.some(id => id.toUpperCase() === modelTier);
                    if (!matchesTier) return false;
                }

                return true;
            });

        // 3. Sorting
        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name_asc":
                    return a.model_display_name.localeCompare(b.model_display_name);
                case "name_desc":
                    return b.model_display_name.localeCompare(a.model_display_name);
                case "context_desc":
                    return b.model_context_window - a.model_context_window;
                case "context_asc":
                    return a.model_context_window - b.model_context_window;
                case "price_in_asc":
                    return ((a.model_pricing_config.input as number) || 0) - ((b.model_pricing_config.input as number) || 0);
                case "price_out_asc":
                    return ((a.model_pricing_config.output as number) || 0) - ((b.model_pricing_config.output as number) || 0);
                default:
                    return 0;
            }
        });
    }, [models, search, activeFilters, sortBy, pendingIds]);

    const confirmDeleteModel = (id: string) => {
        setModelToDeleteId(id);
        setDeleteModalOpen(true);
    };

    const handleDeleteModelExecution = async () => {
        if (!modelToDeleteId) return;
        const model = models?.find(m => m.id === modelToDeleteId);
        if (!model) return;

        deleteWithUndo(model.id, model.model_display_name, () => deleteModel(model.id));
        
        setDeleteModalOpen(false);
        if (selectedModelId === modelToDeleteId) {
            setSelectedModelId(null);
        }
        setModelToDeleteId(null);
    };

    const handleEditModel = (model: LLMModel) => {
        router.push(`/settings/llms/models/${model.id}/edit`);
    };

    const handleSyncAllVisible = async () => {
        const uniqueProviderIds = Array.from(new Set(filteredModels.map(m => m.llm_provider_id)));
        if (uniqueProviderIds.length === 0) return;
        
        toast.info("Zlecono synchronizację cenników dla wszystkich widocznych dostawców...");
        
        for (const pid of uniqueProviderIds) {
            try {
                await syncPricing(pid);
            } catch (e) {
                console.error("Sync error for provider", pid, e);
            }
        }
    };

    const getProviderName = (providerId: string) => {
        return providers?.find(p => p.id === providerId)?.provider_name || "Unknown";
    };

    const lastSyncedInfo = React.useMemo(() => {
        if (!filteredModels || !providers) return null;
        const uniqueProviderIds = Array.from(new Set(filteredModels.map(m => m.llm_provider_id)));
        
        let newestSync: Date | null = null;
        let errors: string[] = [];

        uniqueProviderIds.forEach(pid => {
            const provider = providers.find(p => p.id === pid);
            if (provider?.pricing_last_synced_at) {
                const date = new Date(provider.pricing_last_synced_at);
                if (!newestSync || date > newestSync) {
                    newestSync = date;
                }
            }
            if (provider?.pricing_sync_error) {
                errors.push(`${provider.provider_name}: ${provider.pricing_sync_error}`);
            }
        });

        return { newestSync, errors };
    }, [filteredModels, providers]);

    if (isLoading) {
        return <Skeleton className="h-64 w-full rounded-2xl" />;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-8 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <Input
                                placeholder="Search models by name or id..."
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

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSyncAllVisible}
                        disabled={isSyncingPricing || filteredModels.length === 0}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 hover:text-white"
                    >
                        <RefreshCw size={14} className={cn(isSyncingPricing && "animate-spin")} />
                        Sync Pricing
                    </Button>
                </div>

                <FilterBar 
                    activeFilters={activeFilters}
                    onRemove={handleRemoveFilter}
                    onClearAll={() => setActiveFilters([])}
                />
            </div>

            <div className="border rounded-md bg-background overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Model Name</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Status</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">Context</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    In
                                    <Tooltip content="Koszt za 1 mln tokenów">
                                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                                    </Tooltip>
                                </div>
                            </TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    Out
                                    <Tooltip content="Koszt za 1 mln tokenów">
                                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                                    </Tooltip>
                                </div>
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredModels?.map((model) => (
                            <TableRow 
                                key={model.id} 
                                className="group h-[56px] hover:bg-muted/10 even:bg-muted/15 cursor-pointer"
                                onClick={() => setSelectedModelId(model.id)}
                            >
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold">{model.model_display_name}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{getProviderName(model.llm_provider_id)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-black transition-all",
                                        model.is_available 
                                            ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]" 
                                            : "bg-zinc-800 text-zinc-500 border border-zinc-700 opacity-50"
                                    )}>
                                        {model.is_available ? "Dostępny" : "Niedostępny"}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-base font-mono">
                                    <span suppressHydrationWarning>{model.model_context_window.toLocaleString()}</span>
                                </TableCell>
                                <TableCell className="text-right text-base font-mono">
                                    ${((model.model_pricing_config.input as number) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right text-base font-mono">
                                    ${((model.model_pricing_config.output as number) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()} className="w-[50px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 transition-opacity border-none">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem onClick={() => handleEditModel(model)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit Model
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-red-500 focus:text-red-500" 
                                                onClick={() => confirmDeleteModel(model.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Model
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredModels?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic text-xs">
                                    No models in inventory.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-2 px-2 pt-2">
                {lastSyncedInfo?.errors && lastSyncedInfo.errors.length > 0 && (
                    <div className="flex items-start gap-2 text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Błędy synchronizacji:</span>
                            {lastSyncedInfo.errors.map((err, i) => (
                                <span key={i} className="text-xs font-mono">{err}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 text-zinc-500 justify-end">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-mono text-right">
                        {lastSyncedInfo?.newestSync 
                            ? `Ostatnia udana aktualizacja: ${lastSyncedInfo.newestSync.toLocaleString()} (Auto co 24h)`
                            : "Brak zsynchronizowanych cenników (Auto co 24h)"}
                    </span>
                </div>
            </div>

            <LLMModelSidePeek 
                model={selectedModel}
                isOpen={!!selectedModel}
                onClose={() => setSelectedModelId(null)}
                onDelete={confirmDeleteModel}
                onEdit={handleEditModel}
                providerName={selectedModel ? getProviderName(selectedModel.llm_provider_id) : undefined}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setModelToDeleteId(null);
                }}
                onConfirm={handleDeleteModelExecution}
                title="Usuń Model"
                resourceName={modelToDelete?.model_display_name || "Model"}
                affectedResources={affectedResources}
                isLoading={isLoadingUsage}
            />
        </div>
    );
};
