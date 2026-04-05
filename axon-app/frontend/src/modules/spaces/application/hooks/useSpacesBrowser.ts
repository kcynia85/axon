'use client';

import { useState } from "react";
import { Space } from "../../domain";
import { FilterGroup, ActiveFilter } from "@/shared/domain/filters";

export const useSpacesBrowser = (initialSpaces: readonly Space[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [activeFilters, setActiveFilters] = useState<readonly ActiveFilter[]>([]);
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);

  const [filterGroups, setFilterGroups] = useState<readonly FilterGroup[]>([
    {
      id: "status",
      title: "Status:",
      type: "checkbox",
      options: [
        { id: "active", label: "Active", isChecked: true },
        { id: "archived", label: "Archived", isChecked: false },
        { id: "draft", label: "Draft", isChecked: false },
      ]
    },
    {
      id: "type",
      title: "Type:",
      type: "checkbox",
      options: [
        { id: "discovery", label: "Discovery", isChecked: false },
        { id: "design", label: "Design", isChecked: false },
        { id: "delivery", label: "Delivery", isChecked: false },
      ]
    }
  ]);

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

  const handleToggleFilter = (id: string) => {
    const isCurrentlyActive = activeFilters.some(f => f.id === id);
    if (isCurrentlyActive) {
      handleRemoveFilter(id);
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

  const getFilteredSpaces = (spaces: readonly Space[], query: string, filterIds: string[]) => {
    return spaces.filter(space => {
      const name = (space.name || "").toLowerCase();
      const matchesSearch = name.includes(query.toLowerCase());
      if (!matchesSearch) return false;
      if (filterIds.length === 0) return true;
      const status = (space.status || "").toLowerCase();
      const statusFilters = filterIds.filter(id => ["active", "archived", "draft"].includes(id));
      if (statusFilters.length > 0 && !statusFilters.includes(status)) return false;
      return true;
    });
  };

  // Derived state - React Compiler handles optimization
  const previewResultsCount = getFilteredSpaces(initialSpaces, searchQuery, pendingFilterIds).length;

  const processedSpaces = (() => {
    const appliedFilterIds = activeFilters.map(f => f.id);
    const result = getFilteredSpaces(initialSpaces, searchQuery, appliedFilterIds);

    result.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      switch (sortBy) {
        case "name-asc": return nameA.localeCompare(nameB);
        case "name-desc": return nameB.localeCompare(nameA);
        case "date-asc": return dateA - dateB;
        case "date-desc": return dateB - dateA;
        default: return 0;
      }
    });

    return result;
  })();

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    activeFilters,
    filterGroups,
    processedSpaces,
    previewResultsCount,
    handleToggleFilter,
    handleRemoveFilter,
    handleClearAll,
    handleApplyFilters,
    setPendingFilterIds
  };
};
