'use client';

import React, { useState } from "react";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { AutomationProviderUI } from "./AutomationProvidersBrowserView";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { useAutomationProviders, useDeleteAutomationProvider } from "../application/useAutomationProviders";
import { useRouter } from "next/navigation";
import { AutomationProvidersBrowserView } from "./AutomationProvidersBrowserView";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Nazwa (A-Z)" },
  { id: "name-desc", label: "Nazwa (Z-A)" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "Platforma", groupId: "platform" },
];

const FILTER_GROUPS: readonly FilterGroup[] = [
    {
        id: "platform",
        title: "Platforma",
        type: "checkbox",
        options: [
            { id: "N8N", label: "n8n", isChecked: false },
            { id: "MAKE", label: "Make", isChecked: false },
            { id: "ZAPIER", label: "Zapier", isChecked: false },
            { id: "CUSTOM", label: "Custom", isChecked: false },
        ]
    }
];

export const AutomationProvidersBrowser = () => {
  const router = useRouter();
  const { data: providers = [], isLoading, isError } = useAutomationProviders();
  const { mutateAsync: deleteProvider } = useDeleteAutomationProvider();
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

  const handleProviderClick = (provider: AutomationProviderUI) => {
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

    deleteWithUndo(provider.id, provider.name, () => deleteProvider(provider.id));
    
    setDeleteModalOpen(false);
    if (selectedProviderId === providerToDeleteId) {
        setSelectedProviderId(null);
    }
    setProviderToDeleteId(null);
  };

  const handleConfigureProvider = (provider: AutomationProviderUI) => {
    router.push(`/settings/automation/providers/${provider.id}`);
  };

  // Derived state
  const getFilteredProviders = (): AutomationProviderUI[] => {
    let result = providers
      .filter(provider => !pendingIds.has(provider.id))
      .filter(provider => {
          if (activeFilters.length === 0) return true;
          return activeFilters.some(filter => filter.id === provider.platform);
      })
      .map(provider => ({
        id: provider.id,
        title: provider.name,
        platform: provider.platform,
        authType: provider.auth_type === "HEADER" ? "Header" : provider.auth_type === "BEARER" ? "Bearer Token" : "Brak",
        baseUrl: provider.base_url || undefined,
        categories: [provider.platform]
    }));

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => item.title.toLowerCase().includes(query));
    }

    if (sortBy === "name-asc") {
        result = result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "name-desc") {
        result = result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  };

  const getSelectedProvider = (): AutomationProviderUI | null => {
    if (!selectedProviderId) return null;
    const provider = providers.find(providerItem => providerItem.id === selectedProviderId);
    if (!provider) return null;
    return {
        id: provider.id,
        title: provider.name,
        platform: provider.platform,
        authType: provider.auth_type === "HEADER" ? "Header" : provider.auth_type === "BEARER" ? "Bearer Token" : "Brak",
        baseUrl: provider.base_url || undefined,
        categories: [provider.platform]
    };
  };

  const getAffectedResources = () => {
    // Automations aren't explicitly linked by UUID yet, so we return empty for now
    return [];
  };

  const filteredProviders = getFilteredProviders();
  const selectedProvider = getSelectedProvider();
  const providerToDelete = providers.find(provider => provider.id === providerToDeleteId);
  const affectedResources = getAffectedResources();

  return (
    <AutomationProvidersBrowserView
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
      providerToDeleteName={providerToDelete?.name}
      affectedResources={affectedResources}
    />
  );
};
