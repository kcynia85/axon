'use client';

import React, { useState } from "react";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { useLLMRouters, useDeleteLLMRouter } from "../application/useSettings";
import { useRouter } from "next/navigation";
import { LLMRoutersBrowserView } from "./LLMRoutersBrowserView";
import { DisplayLLMRouter } from "./LLMRoutersBrowserView.types";

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
        title: "Typ Routera",
        type: "checkbox",
        options: [
            { id: "failover", label: "Failover", isChecked: false },
            { id: "load-balancer", label: "Load Balancer", isChecked: false },
            { id: "latency-based", label: "Latency-based", isChecked: false },
        ]
    }
];

export const LLMRoutersBrowser = () => {
  const router = useRouter();
  const { data: routers = [], isLoading, isError } = useLLMRouters();
  const { mutateAsync: deleteRouter } = useDeleteLLMRouter();
  const { deleteWithUndo } = useDeleteWithUndo();
  const { pendingIds } = usePendingDeletionsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name-asc");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);
  const [selectedRouterId, setSelectedRouterId] = useState<string | null>(null);

  // Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [routerToDeleteId, setRouterToDeleteId] = useState<string | null>(null);

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

  const handleRouterClick = (routerObject: DisplayLLMRouter) => {
    setSelectedRouterId(routerObject.id);
  };

  const confirmDeleteRouter = (id: string) => {
    setRouterToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteRouterExecution = async () => {
    if (!routerToDeleteId) return;
    const routerObject = routers.find(router => router.id === routerToDeleteId);
    if (!routerObject) return;

    deleteWithUndo(routerObject.id, routerObject.router_alias, () => deleteRouter(routerObject.id));
    
    setDeleteModalOpen(false);
    if (selectedRouterId === routerToDeleteId) {
        setSelectedRouterId(null);
    }
    setRouterToDeleteId(null);
  };

  const handleConfigureRouter = (routerObject: DisplayLLMRouter) => {
    router.push(`/settings/llms/routers/${routerObject.id}`);
  };

  // Derived state
  const getFilteredRouters = () => {
    let result = routers
      .filter(router => !pendingIds.has(router.id))
      .filter(router => {
          if (activeFilters.length === 0) return true;
          return activeFilters.some(filter => filter.id === router.router_type);
      })
      .map(router => ({
        id: router.id,
        title: router.router_alias,
        description: router.router_description,
        type: router.router_type,
        categories: [router.router_type]
    }));

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(router => router.title.toLowerCase().includes(query));
    }

    return result;
  };

  const filteredRouters = getFilteredRouters();
  const selectedRouter = routers.find(router => router.id === selectedRouterId) || null;
  const routerToDelete = routers.find(router => router.id === routerToDeleteId);

  return (
    <LLMRoutersBrowserView
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
      filteredRouters={filteredRouters}
      previewCount={filteredRouters.length}
      isLoading={isLoading}
      isError={isError}
      selectedRouter={selectedRouter}
      onRouterClick={handleRouterClick}
      onConfigureRouter={handleConfigureRouter}
      onDeleteRouter={confirmDeleteRouter}
      onCloseSidePeek={() => setSelectedRouterId(null)}
      deleteModalOpen={deleteModalOpen}
      onCancelDelete={() => {
          setDeleteModalOpen(false);
          setRouterToDeleteId(null);
      }}
      onConfirmDelete={handleDeleteRouterExecution}
      routerToDeleteName={routerToDelete?.router_alias}
    />
  );
};
