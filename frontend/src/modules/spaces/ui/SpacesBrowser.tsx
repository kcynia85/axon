'use client';

import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, LayoutGrid, List, ChevronDown, Check } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { SpaceList } from "./SpaceList";
import { RecentlyUsed } from "./RecentlyUsed";
import { Space } from "../domain";
import { cn } from "@/shared/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/ui/ui/DropdownMenu";

interface SpacesBrowserProps {
  readonly initialSpaces: readonly Space[];
}

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

/**
 * Quick Filter Pill Component
 */
const FilterPill: React.FC<{
  label: string;
  group: FilterGroup | undefined;
  activeFilters: readonly ActiveFilter[];
  onToggle: (id: string) => void;
}> = ({ label, group, activeFilters, onToggle }) => {
  if (!group) return null;

  const activeInGroup = activeFilters.filter(f => f.category === group.id);
  const isActive = activeInGroup.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
          isActive 
            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white shadow-lg" 
            : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
        )}>
          {label}
          {isActive && (
            <span className="flex items-center justify-center bg-yellow-400 text-black rounded-full min-w-[14px] h-3.5 px-1 text-[8px] font-black">
              {activeInGroup.length}
            </span>
          )}
          <ChevronDown size={10} className={cn("transition-transform opacity-60", isActive ? "text-white dark:text-black" : "text-zinc-400")} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 rounded-xl p-2 shadow-2xl z-50">
        {group.options.map((opt) => {
          const isChecked = activeFilters.some(f => f.id === opt.id);
          return (
            <DropdownMenuItem
              key={opt.id}
              onClick={(e) => {
                e.preventDefault();
                onToggle(opt.id);
              }}
              className="flex items-center gap-3 py-2 px-3 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-white/5 rounded-lg transition-colors group/item"
            >
              <div className={cn(
                "w-3.5 h-3.5 border border-zinc-600 rounded-sm flex items-center justify-center transition-all shrink-0",
                isChecked 
                  ? "bg-white border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                  : "group-hover/item:border-zinc-400"
              )}>
                {isChecked && <Check size={10} className="text-black stroke-[4]" />}
              </div>
              <span className={cn(
                "text-[11px] font-mono transition-colors truncate",
                isChecked ? "text-black dark:text-white font-bold" : "text-zinc-500 group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-300"
              )}>
                {opt.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const SpacesBrowser: React.FC<SpacesBrowserProps> = ({ initialSpaces }) => {
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
      <div className="flex flex-col space-y-8">
        {/* Row 1: Recently Used */}
        <RecentlyUsed spaces={initialSpaces} className="animate-in fade-in slide-in-from-top-2 duration-300" />

        {/* Row 2: Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          <Input 
            placeholder="Search Spaces..." 
            className="pl-10 h-11 border-zinc-200 dark:border-zinc-800"
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

      {/* Row 3: List Header with Filters (Left) and Sort/View (Right) */}
      <div className="flex flex-wrap items-center justify-between gap-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
        
        {/* Filters Group (Left) */}
        <div className="flex items-center gap-4 px-1">
          <div className="flex items-center gap-3">
            <FilterPill 
              label="By Status" 
              group={filterGroups.find(g => g.id === 'status')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
            />
            <FilterPill 
              label="By Type" 
              group={filterGroups.find(g => g.id === 'type')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
            />
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          {/* More Filters Link */}
          <FilterBigMenu 
            groups={filterGroups}
            resultsCount={previewResultsCount}
            onApply={handleApplyFilters}
            onClearAll={handleClearAll}
            onSelectionChange={setPendingFilterIds}
            trigger={
              <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 mb-[-10px] group">
                <Filter size={14} className="group-hover:scale-110 transition-transform" />
                More Filters
              </button>
            }
          />
        </div>

        {/* Sort and View Toggle Group (Right) */}
        <div className="flex items-center gap-10">
          {/* Sort Menu */}
          <SortMenu 
            options={SORT_OPTIONS}
            activeOptionId={sortBy}
            onSelect={setSortBy}
            trigger={
              <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 mb-[-10px]">
                <ArrowUpDown size={14} />
                Sort
              </button>
            }
          />

          {/* View Mode Toggle */}
          <div className="flex items-center gap-6 mb-[-10px]">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all pb-2",
                viewMode === 'grid' 
                  ? "border-black dark:border-white text-black dark:text-white" 
                  : "border-transparent text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              <LayoutGrid size={14} />
              Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all pb-2",
                viewMode === 'list' 
                  ? "border-black dark:border-white text-black dark:text-white" 
                  : "border-transparent text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              <List size={14} />
              List
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <SpaceList spaces={processedSpaces} viewMode={viewMode} />
      </div>
    </div>
  );
};
