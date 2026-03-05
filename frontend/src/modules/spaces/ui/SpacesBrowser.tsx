'use client';

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { SpaceList } from "./SpaceList";
import { RecentlyUsed } from "./RecentlyUsed";
import { Space } from "../domain";
import { ModuleActionBar, QuickFilter } from "@/shared/ui/complex/ModuleActionBar";

type SpacesBrowserProps = {
  readonly initialSpaces: readonly Space[];
}

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "By Status", groupId: "status" },
  { label: "By Type", groupId: "type" },
];

export const SpacesBrowser = ({ initialSpaces }: SpacesBrowserProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Active filters bar state (Applied)
  const [activeFilters, setActiveFilters] = useState<readonly ActiveFilter[]>([]);

  // Pending filters state (Preview while menu is open)
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);

  // Filter groups state
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

  const previewResultsCount = useMemo(() => {
    return getFilteredSpaces(initialSpaces, searchQuery, pendingFilterIds).length;
  }, [initialSpaces, searchQuery, pendingFilterIds]);

  const processedSpaces = useMemo(() => {
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
  }, [initialSpaces, searchQuery, sortBy, activeFilters]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col space-y-12">
        {/* Row 1: Recently Used */}
        <RecentlyUsed spaces={initialSpaces} className="animate-in fade-in slide-in-from-top-2 duration-300" />

        {/* Row 2: Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          <Input 
            placeholder="Search Spaces..." 
            className="pl-10 h-[52px] py-3 border-zinc-200 dark:border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Row 3: Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Active Filters</span>
            <FilterBar 
              activeFilters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
              className="px-1"
            />
          </div>
        )}
      </div>

      {/* Unified Action Bar (Filters, Sort, View) */}
      <ModuleActionBar 
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        quickFilters={QUICK_FILTERS}
        onToggleFilter={handleToggleFilter}
        onApplyFilters={handleApplyFilters}
        onClearAllFilters={handleClearAll}
        onPendingFilterIdsChange={setPendingFilterIds}
        resultsCount={previewResultsCount}
        sortOptions={SORT_OPTIONS}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="pt-2">
        <SpaceList spaces={processedSpaces} viewMode={viewMode} />
      </div>
    </div>
  );
};
