"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLLMModels, useDeleteLLMModel, useLLMModelUsage } from "../application/useSettings";
import { useLLMProviders, useSyncProviderPricing } from "../application/useLLMProviders";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import type { LLMModel } from "@/shared/domain/settings";
import { LLMModelsListView } from "./LLMModelsListView";

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

/**
 * LLMModelsList: Container component for LLM models.
 * Standard: Container pattern, 0% manual memoization (no useMemo).
 */
export const LLMModelsList = () => {
    const router = useRouter();
    const { data: models = [], isLoading } = useLLMModels();
    const { data: providers = [] } = useLLMProviders();
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

    // Derived State - Zero Manual Optimization
    const modelToDelete = modelToDeleteId ? models.find(model => model.id === modelToDeleteId) || null : null;
    const selectedModel = selectedModelId ? models.find(model => model.id === selectedModelId) || null : null;

    const affectedResources = usageData?.used_by?.map((name, index) => ({
        id: `usage-${index}`,
        name: name,
        role: "Assigned To"
    })) || [];

    const activeIds = activeFilters.map(filter => filter.id);
    const filterGroups: FilterGroup[] = [
        {
            id: "providers",
            title: "Providers",
            type: "checkbox",
            options: providers.map(provider => ({
                id: provider.id,
                label: provider.provider_name,
                isChecked: activeIds.includes(provider.id)
            }))
        },
        {
            id: "capabilities",
            title: "Capabilities",
            type: "checkbox",
            options: STATIC_CAPABILITIES.map(capability => ({
                id: capability.id,
                label: capability.label,
                isChecked: activeIds.includes(capability.id)
            }))
        },
        {
            id: "tiers",
            title: "Tiers",
            type: "checkbox",
            options: STATIC_TIERS.map(tier => ({
                id: tier.id,
                label: tier.label,
                isChecked: activeIds.includes(tier.id)
            }))
        }
    ];

    const getProviderName = (providerId: string) => {
        return providers.find(provider => provider.id === providerId)?.provider_name || "Unknown";
    };

    const handleApplyFilters = (selectedIds: string[]) => {
        const nextFilters: ActiveFilter[] = [];
        filterGroups.forEach(group => {
            group.options.forEach(option => {
                if (selectedIds.includes(option.id)) {
                    nextFilters.push({
                        id: option.id,
                        label: option.label,
                        category: group.id
                    });
                }
            });
        });
        setActiveFilters(nextFilters);
        setPendingFilterIds(selectedIds);
    };

    const handleRemoveFilter = (filterId: string) => {
        setActiveFilters(previousFilters => previousFilters.filter(filter => filter.id !== filterId));
        setPendingFilterIds(previousIds => previousIds.filter(id => id !== filterId));
    };

    // Computation derived without useMemo
    let previewCount = 0;
    const filteredModels = models
        .filter(model => !pendingIds.has(model.id))
        .filter(model => {
            const matchesSearch = 
                model.model_display_name.toLowerCase().includes(search.toLowerCase()) ||
                model.model_id.toLowerCase().includes(search.toLowerCase());
            
            if (!matchesSearch) return false;

            const selectedProviderIds = activeFilters.filter(filter => filter.category === "providers").map(filter => filter.id);
            const selectedCapabilityIds = activeFilters.filter(filter => filter.category === "capabilities").map(filter => filter.id);
            const selectedTierIds = activeFilters.filter(filter => filter.category === "tiers").map(filter => filter.id);

            if (selectedProviderIds.length > 0 && !selectedProviderIds.includes(model.llm_provider_id)) return false;
            if (selectedCapabilityIds.length > 0 && !selectedCapabilityIds.every(id => model.model_capabilities_flags?.includes(id))) return false;
            if (selectedTierIds.length > 0) {
                const modelTier = model.model_tier.toUpperCase();
                if (!selectedTierIds.some(id => id.toUpperCase() === modelTier)) return false;
            }

            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name_asc": return a.model_display_name.localeCompare(b.model_display_name);
                case "name_desc": return b.model_display_name.localeCompare(a.model_display_name);
                case "context_desc": return b.model_context_window - a.model_context_window;
                case "context_asc": return a.model_context_window - b.model_context_window;
                case "price_in_asc": return ((a.model_pricing_config.input as number) || 0) - ((b.model_pricing_config.input as number) || 0);
                case "price_out_asc": return ((a.model_pricing_config.output as number) || 0) - ((b.model_pricing_config.output as number) || 0);
                default: return 0;
            }
        });

    // Compute preview count (different logic than filtered models to match original behavior before apply)
    previewCount = models.filter(model => {
        if (pendingIds.has(model.id)) return false;
        const matchesSearch = 
            model.model_display_name.toLowerCase().includes(search.toLowerCase()) ||
            model.model_id.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;
        if (pendingFilterIds.length === 0) return true;

        const selectedProviderIds = pendingFilterIds.filter(id => providers.some(provider => provider.id === id));
        const selectedCapabilityIds = pendingFilterIds.filter(id => STATIC_CAPABILITIES.some(capability => capability.id === id));
        const selectedTierIds = pendingFilterIds.filter(id => STATIC_TIERS.some(tier => tier.id === id));

        if (selectedProviderIds.length > 0 && !selectedProviderIds.includes(model.llm_provider_id)) return false;
        if (selectedCapabilityIds.length > 0 && !selectedCapabilityIds.every(id => model.model_capabilities_flags?.includes(id))) return false;
        if (selectedTierIds.length > 0) {
            const modelTier = model.model_tier.toUpperCase();
            if (!selectedTierIds.some(id => id.toUpperCase() === modelTier)) return false;
        }
        return true;
    }).length;

    const handleDeleteModelExecution = async () => {
        if (!modelToDeleteId) return;
        const model = models.find(model => model.id === modelToDeleteId);
        if (!model) return;

        deleteWithUndo(model.id, model.model_display_name, () => deleteModel(model.id));
        
        setDeleteModalOpen(false);
        if (selectedModelId === modelToDeleteId) {
            setSelectedModelId(null);
        }
        setModelToDeleteId(null);
    };

    const handleSyncAllVisible = async () => {
        const uniqueProviderIds = Array.from(new Set(filteredModels.map(model => model.llm_provider_id)));
        if (uniqueProviderIds.length === 0) return;
        
        toast.info("Zlecono synchronizację cenników dla wszystkich dostawców...");
        
        for (const providerId of uniqueProviderIds) {
            try {
                await syncPricing(providerId);
            } catch (error) {
                console.error("Sync error for provider", providerId, error);
            }
        }
    };

    const uniqueProviderIds = Array.from(new Set(filteredModels.map(model => model.llm_provider_id)));
    let newestSync: Date | null = null;
    const syncErrors: string[] = [];

    uniqueProviderIds.forEach(providerId => {
        const provider = providers.find(provider => provider.id === providerId);
        if (provider?.pricing_last_synced_at) {
            const date = new Date(provider.pricing_last_synced_at);
            if (!newestSync || date > newestSync) {
                newestSync = date;
            }
        }
        if (provider?.pricing_sync_error) {
            syncErrors.push(`${provider.provider_name}: ${provider.pricing_sync_error}`);
        }
    });

    const lastSyncedInfo = filteredModels.length > 0 && providers.length > 0 
        ? { newestSync, errors: syncErrors } 
        : null;

    return (
        <LLMModelsListView
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={() => { setActiveFilters([]); setPendingFilterIds([]); }}
            onApplyFilters={handleApplyFilters}
            onSelectionChange={setPendingFilterIds}
            filteredModels={filteredModels}
            previewCount={previewCount}
            isLoading={isLoading}
            isSyncingPricing={isSyncingPricing}
            onSyncAllVisible={handleSyncAllVisible}
            getProviderName={getProviderName}
            onEditModel={(model) => router.push(`/settings/llms/models/${model.id}/edit`)}
            onDeleteModel={(id) => { setModelToDeleteId(id); setDeleteModalOpen(true); }}
            selectedModel={selectedModel}
            onSelectedModelChange={setSelectedModelId}
            deleteModalOpen={deleteModalOpen}
            onDeleteModalOpenChange={setDeleteModalOpen}
            onDeleteConfirm={handleDeleteModelExecution}
            modelToDeleteName={modelToDelete?.model_display_name}
            affectedResources={affectedResources}
            isLoadingUsage={isLoadingUsage}
            lastSyncedInfo={lastSyncedInfo}
        />
    );
};
