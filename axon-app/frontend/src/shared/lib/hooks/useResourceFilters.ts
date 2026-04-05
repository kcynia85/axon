"use client";

import { useState } from "react";
import { ActiveFilter, FilterGroup } from "@/shared/domain/filters";

type UseResourceFiltersOptions<T> = {
  readonly initialSortBy?: string;
  readonly filterItems: (items: readonly T[], query: string, filterIds: string[]) => T[];
  readonly initialFilterGroups?: readonly FilterGroup[];
}

export const useResourceFilters = <T>({
  initialSortBy = "date-desc",
  filterItems,
  initialFilterGroups = [],
}: UseResourceFiltersOptions<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [activeFilters, setActiveFilters] = useState<readonly ActiveFilter[]>([]);
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);
  const [filterGroups, setFilterGroups] = useState<readonly FilterGroup[]>(initialFilterGroups);

  const handleToggleFilter = (id: string) => {
    const isCurrentlyActive = activeFilters.some(f => f.id === id);
    if (isCurrentlyActive) {
      const nextFilters = activeFilters.filter(f => f.id !== id);
      setActiveFilters(nextFilters);
      setPendingFilterIds(nextFilters.map(f => f.id));
      setFilterGroups(prev => prev.map(g => ({
        ...g,
        options: g.options.map(o => o.id === id ? { ...o, isChecked: false } : o)
      })));
    } else {
      const actualGroup = filterGroups.find(g => g.options.some(o => o.id === id));
      const option = actualGroup?.options.find(o => o.id === id);
      
      if (actualGroup && option) {
        const newActiveFilters = [...activeFilters, { id: option.id, label: option.label, category: actualGroup.id }];
        setActiveFilters(newActiveFilters);
        setPendingFilterIds(newActiveFilters.map(f => f.id));
        setFilterGroups(prev => prev.map(g => g.id === actualGroup.id ? {
          ...g,
          options: g.options.map(o => o.id === id ? { ...o, isChecked: true } : o)
        } : g));
      }
    }
  };

  const handleRemoveFilter = (id: string) => {
    const nextFilters = activeFilters.filter(f => f.id !== id);
    setActiveFilters(nextFilters);
    setPendingFilterIds(nextFilters.map(f => f.id));
    setFilterGroups(prev => prev.map(group => ({
      ...group,
      options: group.options.map(opt => 
        opt.id === id ? { ...opt, isChecked: false } : opt
      )
    })));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setPendingFilterIds([]);
    setFilterGroups(prev => prev.map(group => ({
      ...group,
      options: group.options.map(opt => ({ ...opt, isChecked: false }))
    })));
  };

  const handleApplyFilters = (selectedIds: string[]) => {
    setPendingFilterIds(selectedIds);
    setFilterGroups(prev => prev.map(group => ({
      ...group,
      options: group.options.map(opt => ({
        ...opt,
        isChecked: selectedIds.includes(opt.id)
      }))
    })));

    const newActiveFilters: ActiveFilter[] = [];
    filterGroups.forEach(group => {
      group.options.forEach(opt => {
        if (selectedIds.includes(opt.id)) {
          newActiveFilters.push({ id: opt.id, label: opt.label, category: group.id });
        }
      });
    });
    setActiveFilters(newActiveFilters);
  };

  const getFilteredItems = (items: readonly T[]) => {
    return filterItems(items, searchQuery, activeFilters.map(f => f.id));
  };

  const getPreviewCount = (items: readonly T[]) => {
    return filterItems(items, searchQuery, pendingFilterIds).length;
  };

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFilters,
    pendingFilterIds,
    setPendingFilterIds,
    filterGroups,
    handleToggleFilter,
    handleRemoveFilter,
    handleClearAll,
    handleApplyFilters,
    getFilteredItems,
    getPreviewCount,
  };
}
