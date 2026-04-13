'use client';

import React, { useState } from "react";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { Provider } from "./LLMProviderSidePeek";
import { useLLMModels } from "../application/useSettings";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { useLLMProviders, useDeleteLLMProvider } from "../application/useLLMProviders";
import { useRouter } from "next/navigation";
import { LLMProvidersBrowserView } from "./LLMProvidersBrowserView";

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

export const LLMProvidersBrowser = () => {
  const router = useRouter();
  const { data: providers = [], isLoading, isError } = useLLMProviders();
  const { data: allModels = [] } = useLLMModels();
  const { mutateAsync: deleteProvider } = useDeleteLLMProvider();
  const { deleteWithUndo } = useDeleteWithUndo();
  const { pendingIds } = usePendingDeletionsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name-asc");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [providerToDeleteId, setProviderToDeleteId] = useState<string | null>(null);

  const handleRemoveFilter = (id: string) => {
    setActiveFilters(previousFilters => previousFilters.filter(filter => filter.id !== id));
    setPendingFilterIds(previousIds => previousIds.filter(pendingId => pendingId !== id));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setPendingFilterIds([]);
  };

  const handleApplyFilters = (selectedIds: string[]) => {
      const nextFilters: ActiveFilter[] = [];
      FILTER_GROUPS.forEach(group => {
          group.options.forEach(option => {
              if (selectedIds.includes(option.id)) {
                  nextFilters.push({ id: option.id, label: option.label, category: group.id });
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
      const option = FILTER_GROUPS.flatMap(group => group.options.map(option => ({...option, groupId: group.id}))).find(option => option.id === id);
      if (option) {
          if (activeFilters.some(filter => filter.id === id)) {
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
    const provider = providers.find(provider => provider.id === providerToDeleteId);
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

  // Derived state - React Compiler will optimize
  const getFilteredProviders = () => {
    let result = providers
      .filter(provider => !pendingIds.has(provider.id))
      .filter(provider => {
          if (activeFilters.length === 0) return true;
          return activeFilters.some(filter => filter.id === provider.provider_type);
      })
      .map(provider => ({
        id: provider.id,
        title: provider.provider_name,
        type: provider.provider_type === "cloud" ? "Cloud / SaaS" : provider.provider_type === "meta" ? "Meta-Provider" : "Local / Self-Hosted",
        schema: provider.provider_type === "meta" ? "Native API" : "OpenAI v1",
        apiKey: provider.provider_api_key || "N/A",
        pricing: provider.provider_type === "meta" ? "Live API Sync" : "Pay-as-you-go",
        url: provider.provider_api_endpoint || undefined,
        categories: [provider.provider_type === "cloud" ? "Cloud / SaaS" : provider.provider_type === "meta" ? "Meta-Provider" : "Local / Self-Hosted"]
    }));

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => item.title.toLowerCase().includes(query));
    }

    return result;
  };

  const getSelectedProvider = (): Provider | null => {
    if (!selectedProviderId) return null;
    const provider = providers.find(providerItem => providerItem.id === selectedProviderId);
    if (!provider) return null;
    return {
        id: provider.id,
        title: provider.provider_name,
        type: provider.provider_type === "cloud" ? "Cloud / SaaS" : provider.provider_type === "meta" ? "Meta-Provider" : "Local / Self-Hosted",
        schema: provider.provider_type === "meta" ? "Native API" : "OpenAI v1",
        apiKey: provider.provider_api_key || "N/A",
        pricing: provider.provider_type === "meta" ? "Live API Sync" : "Pay-as-you-go",
        url: provider.provider_api_endpoint || undefined,
        categories: [provider.provider_type === "cloud" ? "Cloud / SaaS" : provider.provider_type === "meta" ? "Meta-Provider" : "Local / Self-Hosted"]
    } as Provider;
  };

  const getAffectedResources = () => {
    if (!providerToDeleteId) return [];
    return allModels
      .filter(model => model.llm_provider_id === providerToDeleteId)
      .map(model => ({
        id: model.id,
        name: model.model_display_name,
        role: "Linked Model"
      }));
  };

  const filteredProviders = getFilteredProviders();
  const selectedProvider = getSelectedProvider();
  const providerToDelete = providers.find(provider => provider.id === providerToDeleteId);
  const affectedResources = getAffectedResources();

  return (
    <LLMProvidersBrowserView
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      setViewMode={setViewMode}
      sortBy={sortBy}
      onSortChange={setSortBy}
      activeFilters={activeFilters}
      filterGroups={FILTER_GROUPS}
      quickFilters={QUICK_FILTERS}
      sortOptions={SORT_OPTIONS}
      onToggleFilter={handleToggleFilter}
      onRemoveFilter={handleRemoveFilter}
      onClearAllFilters={handleClearAll}
      onApplyFilters={handleApplyFilters}
      onSelectionChange={handleSelectionChange}
      filteredProviders={filteredProviders}
      previewCount={filteredProviders.length}
      isLoading={isLoading}
      isError={isError}
      selectedProvider={selectedProvider}
      onProviderClick={handleProviderClick}
      onConfigureProvider={handleConfigureProvider}
      onDeleteProvider={confirmDeleteProvider}
      onCloseSidePeek={() => setSelectedProviderId(null)}
      deleteModalOpen={deleteModalOpen}
      onCancelDelete={() => {
          setDeleteModalOpen(false);
          setProviderToDeleteId(null);
      }}
      onConfirmDelete={handleDeleteProviderExecution}
      providerToDeleteName={providerToDelete?.provider_name}
      affectedResources={affectedResources}
    />
  );
};
