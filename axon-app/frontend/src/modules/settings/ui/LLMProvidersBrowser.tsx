'use client';

import React, { useState, useMemo } from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { Button } from "@/shared/ui/ui/Button";
import { LLMProviderSidePeek, Provider } from "./LLMProviderSidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { useLLMModels } from "../application/useSettings";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { useLLMProviders, useDeleteLLMProvider } from "../application/useLLMProviders";
import { useRouter } from "next/navigation";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Nazwa (A-Z)" },
  { id: "name-desc", label: "Nazwa (Z-A)" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "Type", groupId: "type" },
];

const FILTER_GROUPS: readonly FilterGroup[] = [
    {
        id: "type",
        title: "Typ Dostawcy",
        type: "checkbox",
        options: [
            { id: "cloud", label: "Cloud / SaaS", isChecked: false },
            { id: "meta", label: "Meta-Provider", isChecked: false },
            { id: "local", label: "Local / Self-Hosted", isChecked: false },
        ]
    }
];

/**
 * LLMProvidersBrowser - Browser for LLM Providers (OpenAI, OpenRouter, Ollama etc).
 */
export const LLMProvidersBrowser = () => {
  const router = useRouter();
  const { data: providers = [], isLoading, isError } = useLLMProviders();
  const { data: allModels = [] } = useLLMModels();
  const { mutateAsync: deleteProvider } = useDeleteLLMProvider();
  const { deleteWithUndo } = useDeleteWithUndo();
  const { pendingIds } = usePendingDeletionsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("name-asc");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [providerToDeleteId, setProviderToDeleteId] = useState<string | null>(null);

  const providerToDelete = useMemo(() => {
    return providers.find(p => p.id === providerToDeleteId);
  }, [providers, providerToDeleteId]);

  const affectedResources = useMemo(() => {
    if (!providerToDeleteId) return [];
    return allModels
      .filter(m => m.llm_provider_id === providerToDeleteId)
      .map(m => ({
        id: m.id,
        name: m.model_display_name,
        role: "Linked Model"
      }));
  }, [allModels, providerToDeleteId]);

  const selectedProvider = useMemo(() => {
    if (!selectedProviderId) return null;
    const p = providers.find(prov => prov.id === selectedProviderId);
    if (!p) return null;
    return {
        id: p.id,
        title: p.provider_name,
        type: p.provider_type === "cloud" ? "Cloud / SaaS" : p.provider_type === "meta" ? "Meta-Provider" : "Local / Self-Hosted",
        schema: p.provider_type === "meta" ? "Native API" : "OpenAI v1",
        apiKey: p.provider_api_key || "N/A",
        pricing: p.provider_type === "meta" ? "Live API Sync" : "Pay-as-you-go",
        url: p.provider_api_endpoint || undefined,
        categories: [p.provider_type === "cloud" ? "Cloud / SaaS" : p.provider_type === "meta" ? "Meta-Provider" : "Local / Self-Hosted"]
    } as Provider;
  }, [providers, selectedProviderId]);

  const previewCount = useMemo(() => {
    return providers.filter(p => {
        if (pendingIds.has(p.id)) return false;
        
        const title = p.provider_name.toLowerCase();
        const query = searchQuery.toLowerCase();
        if (searchQuery && !title.includes(query)) return false;

        if (pendingFilterIds.length === 0) return true;
        return pendingFilterIds.includes(p.provider_type);
    }).length;
  }, [providers, searchQuery, pendingFilterIds, pendingIds]);

  const filteredProviders = useMemo(() => {
    let result = providers
      .filter(p => !pendingIds.has(p.id))
      .filter(p => {
          if (activeFilters.length === 0) return true;
          return activeFilters.some(f => f.id === p.provider_type);
      })
      .map(p => ({
        id: p.id,
        title: p.provider_name,
        type: p.provider_type === "cloud" ? "Cloud / SaaS" : p.provider_type === "meta" ? "Meta-Provider" : "Local / Self-Hosted",
        schema: p.provider_type === "meta" ? "Native API" : "OpenAI v1",
        apiKey: p.provider_api_key || "N/A",
        pricing: p.provider_type === "meta" ? "Live API Sync" : "Pay-as-you-go",
        url: p.provider_api_endpoint || undefined,
        categories: [p.provider_type === "cloud" ? "Cloud / SaaS" : p.provider_type === "meta" ? "Meta-Provider" : "Local / Self-Hosted"]
    }));

    // Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(r => r.title.toLowerCase().includes(query));
    }

    return result;
  }, [providers, searchQuery, pendingIds, activeFilters]);

  const handleRemoveFilter = (id: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== id));
    setPendingFilterIds(prev => prev.filter(pId => pId !== id));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setPendingFilterIds([]);
  };

  const handleApplyFilters = (selectedIds: string[]) => {
      const nextFilters: ActiveFilter[] = [];
      FILTER_GROUPS.forEach(group => {
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
      const option = FILTER_GROUPS.flatMap(g => g.options.map(o => ({...o, groupId: g.id}))).find(o => o.id === id);
      if (option) {
          if (activeFilters.some(f => f.id === id)) {
              handleRemoveFilter(id);
          } else {
              setActiveFilters([...activeFilters, { id: option.id, label: option.label, category: option.groupId }]);
              setPendingFilterIds([...pendingFilterIds, id]);
          }
      }
  };

  const handleProviderClick = (provider: Provider) => {
    setSelectedProviderId(provider.id);
  };

  const confirmDeleteProvider = (id: string) => {
    setProviderToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteProviderExecution = async () => {
    if (!providerToDeleteId) return;
    const provider = providers.find(p => p.id === providerToDeleteId);
    if (!provider) return;

    deleteWithUndo(provider.id, provider.provider_name, () => deleteProvider(provider.id));
    
    setDeleteModalOpen(false);
    if (selectedProviderId === providerToDeleteId) {
        setSelectedProviderId(null);
    }
    setProviderToDeleteId(null);
  };

  const handleConfigureProvider = (provider: Provider) => {
    router.push(`/settings/llms/providers/${provider.id}`);
  };

  return (
    <BrowserLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Szukaj dostawców..."
      activeFilters={activeFilters.length > 0 && (
        <FilterBar 
          activeFilters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      )}
      actionBar={
        <ActionBar 
          filterGroups={FILTER_GROUPS}
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
        items={filteredProviders}
        isLoading={isLoading}
        isError={isError}
        viewMode={viewMode}
        renderItem={(provider) => (
            <ResourceCard
                key={provider.id}
                title={provider.title}
                description={null}
                href="#"
                onClick={() => handleProviderClick(provider)}
                categories={provider.categories}
                onEdit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const p = providers.find(prov => prov.id === provider.id);
                    if (p) handleConfigureProvider(p as any);
                }}
                onDelete={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    confirmDeleteProvider(provider.id);
                }}
            />
        )}
      />

      <LLMProviderSidePeek 
        provider={selectedProvider}
        isOpen={!!selectedProvider}
        onClose={() => setSelectedProviderId(null)}
        onConfigure={handleConfigureProvider}
        onDelete={confirmDeleteProvider}
      />

      <DestructiveDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
            setDeleteModalOpen(false);
            setProviderToDeleteId(null);
        }}
        onConfirm={handleDeleteProviderExecution}
        title="Usuń Dostawcę"
        resourceName={providerToDelete?.provider_name || "Dostawca"}
        affectedResources={affectedResources}
      />
    </BrowserLayout>
  );
};
