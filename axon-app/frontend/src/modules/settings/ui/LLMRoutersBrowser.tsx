'use client';

import React, { useState, useMemo } from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { LLMRoutersList } from "./LLMRoutersList";
import { useLLMRouters, useLLMModels, useDeleteLLMRouter } from "../application/useSettings";
import { useLLMProviders } from "../application/useLLMProviders";
import { useRouter } from "next/navigation";
import { LLMRouterSidePeek } from "./LLMRouterSidePeek";
import type { LLMRouter } from "@/shared/domain/settings";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Nazwa (A-Z)" },
  { id: "name-desc", label: "Nazwa (Z-A)" },
  { id: "newest", label: "Najnowsze" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "Strategy", groupId: "strategy" },
];

const FILTER_GROUPS: readonly FilterGroup[] = [
    {
        id: "strategy",
        title: "Strategia",
        type: "checkbox",
        options: [
            { id: "fallback", label: "Fallback", isChecked: false },
            { id: "load_balancer", label: "Load Balancer", isChecked: false },
            { id: "Cost_Optimized", label: "Cost Optimized", isChecked: false },
            { id: "Speed_Optimized", label: "Speed Optimized", isChecked: false },
            { id: "Quality_Optimized", label: "Quality Optimized", isChecked: false },
        ]
    }
];

import { Button } from "@/shared/ui/ui/Button";

/**
 * LLMRoutersBrowser - Browser for LLM Routers.
 * Includes Delete with Undo pattern.
 */
export const LLMRoutersBrowser = () => {
  const routerNav = useRouter();
  const { data: routers = [], isLoading, isError } = useLLMRouters();
  const { data: models = [] } = useLLMModels();
  const { data: providers = [] } = useLLMProviders();
  const { mutateAsync: deleteRouter } = useDeleteLLMRouter();
  const { deleteWithUndo } = useDeleteWithUndo();
  const { pendingIds } = usePendingDeletionsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);
  const [selectedRouterId, setSelectedRouterId] = useState<string | null>(null);

  const selectedRouter = useMemo(() => {
    if (!selectedRouterId) return null;
    return routers.find(r => r.id === selectedRouterId) || null;
  }, [routers, selectedRouterId]);

  const getModelName = (id: string) => {
    const model = models.find(m => m.id === id);
    if (!model) return "Unknown Model";
    
    const provider = providers.find(p => p.id === model.llm_provider_id);
    if (provider) {
        return `${provider.provider_name} / ${model.model_display_name}`;
    }
    
    return model.model_display_name;
  };

  const previewCount = useMemo(() => {
    let result = routers.filter(r => !pendingIds.has(r.id));

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(r => r.router_alias.toLowerCase().includes(query));
    }

    if (pendingFilterIds.length > 0) {
        result = result.filter(r => pendingFilterIds.includes(r.router_strategy));
    }

    return result.length;
  }, [routers, searchQuery, pendingFilterIds, pendingIds]);

  const filteredRouters = useMemo(() => {
    let result = routers.filter(r => !pendingIds.has(r.id));

    // Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(r => 
            r.router_alias.toLowerCase().includes(query)
        );
    }

    // Filters
    if (activeFilters.length > 0) {
        const strategyFilters = activeFilters.filter(f => f.category === "strategy").map(f => f.id);
        if (strategyFilters.length > 0) {
            result = result.filter(r => strategyFilters.includes(r.router_strategy));
        }
    }

    // Sort
    result.sort((a, b) => {
        if (sortBy === "name-asc") return a.router_alias.localeCompare(b.router_alias);
        if (sortBy === "name-desc") return b.router_alias.localeCompare(a.router_alias);
        if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return 0;
    });

    return result;
  }, [routers, searchQuery, activeFilters, sortBy, pendingIds]);

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

  const handleDeleteRouter = async (id: string) => {
    const router = routers.find(r => r.id === id);
    if (!router) return;

    if (confirm(`Czy na pewno chcesz usunąć router "${router.router_alias}"?`)) {
        deleteWithUndo(router.id, router.router_alias, () => deleteRouter(router.id));
        setSelectedRouterId(null);
    }
  };

  const handleConfigureRouter = (r: LLMRouter) => {
    routerNav.push(`/settings/llms/routers/${r.id}`);
  };

  return (
    <BrowserLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Szukaj routerów..."
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
      <LLMRoutersList 
        items={filteredRouters}
        isLoading={isLoading}
        isError={isError}
        viewMode={viewMode}
        onItemClick={(r) => setSelectedRouterId(r?.id || null)}
        onDelete={handleDeleteRouter}
        onEdit={handleConfigureRouter}
      />

      <LLMRouterSidePeek 
        router={selectedRouter}
        isOpen={!!selectedRouter}
        onClose={() => setSelectedRouterId(null)}
        onConfigure={handleConfigureRouter}
        onDelete={handleDeleteRouter}
        getModelName={getModelName}
      />
    </BrowserLayout>
  );
};
