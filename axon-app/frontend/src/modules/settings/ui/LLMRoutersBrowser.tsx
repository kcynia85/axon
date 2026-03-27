'use client';

import React, { useState, useMemo } from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { LLMRoutersList } from "./LLMRoutersList";
import { useLLMRouters, useLLMModels, useDeleteLLMRouter } from "../application/useSettings";
import { useRouter } from "next/navigation";
import { LLMRouterSidePeek } from "./LLMRouterSidePeek";
import type { LLMRouter } from "@/shared/domain/settings";

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
        label: "Strategia",
        options: [
            { id: "fallback", label: "Fallback" },
            { id: "load_balancer", label: "Load Balancer" },
            { id: "Cost_Optimized", label: "Cost Optimized" },
            { id: "Speed_Optimized", label: "Speed Optimized" },
            { id: "Quality_Optimized", label: "Quality Optimized" },
        ]
    }
];

import { Button } from "@/shared/ui/ui/Button";

export const LLMRoutersBrowser = () => {
  const routerNav = useRouter();
  const { data: routers = [], isLoading, isError } = useLLMRouters();
  const { data: models = [] } = useLLMModels();
  const { mutateAsync: deleteRouter } = useDeleteLLMRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [selectedRouter, setSelectedRouter] = useState<LLMRouter | null>(null);

  const getModelName = (id: string) => {
    const model = models.find(m => m.id === id);
    return model?.model_display_name || "Unknown Model";
  };

  const filteredRouters = useMemo(() => {
    let result = [...routers];

    // Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(r => 
            r.router_alias.toLowerCase().includes(query)
        );
    }

    // Filters
    if (activeFilters.length > 0) {
        const strategyFilters = activeFilters.filter(f => f.groupId === "strategy").map(f => f.id);
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
  }, [routers, searchQuery, activeFilters, sortBy]);

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
              setActiveFilters([...activeFilters, { id: option.id, label: option.label, groupId: option.groupId }]);
          }
      }
  };

  const handleDeleteRouter = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć ten router?")) {
        try {
            await deleteRouter(id);
            setSelectedRouter(null);
        } catch (error) {
            console.error("Failed to delete router:", error);
        }
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
          onApplyFilters={() => {}} 
          onClearAllFilters={handleClearAll}
          resultsCount={filteredRouters.length}
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
        onItemClick={setSelectedRouter}
        onDelete={handleDeleteRouter}
        onEdit={handleConfigureRouter}
      />

      <LLMRouterSidePeek 
        router={selectedRouter}
        isOpen={!!selectedRouter}
        onClose={() => setSelectedRouter(null)}
        onConfigure={handleConfigureRouter}
        onDelete={handleDeleteRouter}
        getModelName={getModelName}
      />
    </BrowserLayout>
  );
};
