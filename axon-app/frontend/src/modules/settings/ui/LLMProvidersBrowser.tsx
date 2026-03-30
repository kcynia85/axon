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

const INITIAL_ACTIVE_FILTERS: ActiveFilter[] = [];

import { useLLMProviders, useDeleteLLMProvider } from "../application/useLLMProviders";
import { useRouter } from "next/navigation";

/**
 * LLMProvidersBrowser - Browser for LLM Providers (OpenAI, OpenRouter, Ollama etc).
 * Now uses LLMProviderSidePeek for detailed view and configuration.
 */
export const LLMProvidersBrowser = () => {
  const router = useRouter();
  const { data: providers = [], isLoading, isError } = useLLMProviders();
  const { mutateAsync: deleteProvider } = useDeleteLLMProvider();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("name-asc");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const filteredProviders = useMemo(() => {
    let result = providers.map(p => ({
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
  }, [providers, searchQuery]);

  const handleRemoveFilter = (id: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
  };

  const handleToggleFilter = (id: string) => {
      const option = FILTER_GROUPS.flatMap(g => g.options.map(o => ({...o, groupId: g.id}))).find(o => o.id === id);
      if (option) {
          if (activeFilters.some(f => f.id === id)) {
              handleRemoveFilter(id);
          } else {
              setActiveFilters([...activeFilters, { id: option.id, label: option.label, category: option.groupId }]);
          }
      }
  };

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const handleDeleteProvider = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć tego dostawcę? Spowoduje to również usunięcie powiązanych modeli.")) {
        try {
            await deleteProvider(id);
            setSelectedProvider(null);
        } catch (error) {
            console.error("Failed to delete provider:", error);
        }
    }
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
          onApplyFilters={() => {}} 
          onClearAllFilters={handleClearAll}
          resultsCount={filteredProviders.length}
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
            />
        )}
      />

      <LLMProviderSidePeek 
        provider={selectedProvider}
        isOpen={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
        onConfigure={handleConfigureProvider}
        onDelete={handleDeleteProvider}
      />
    </BrowserLayout>
  );
};
