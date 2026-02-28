'use client';

import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { Button } from "@/shared/ui/ui/Button";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { ProjectList } from "./ProjectList";
import { Project } from "../../../domain";
import { cn } from "@/shared/lib/utils";

interface ProjectsBrowserProps {
  readonly initialProjects: readonly Project[];
}

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

export const ProjectsBrowser: React.FC<ProjectsBrowserProps> = ({ initialProjects }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Active filters bar state (Applied)
  const [activeFilters, setActiveFilters] = useState<readonly ActiveFilter[]>([
    { id: "in-progress", label: "In Progress", category: "status" }
  ]);

  // Pending filters state (Preview while menu is open)
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>(["in-progress"]);

  // Big menu filter groups state
  const [filterGroups, setFilterGroups] = useState<readonly FilterGroup[]>([
    {
      id: "status",
      title: "Status:",
      type: "checkbox",
      options: [
        { id: "in-progress", label: "In Progress", isChecked: true },
        { id: "completed", label: "Completed", isChecked: false },
        { id: "idea", label: "Idea", isChecked: false },
      ]
    },
    {
      id: "workspaces",
      title: "Workspaces:",
      type: "checkbox",
      options: [
        { id: "global", label: "Global", isChecked: false },
        { id: "product-mgmt", label: "Product Management", isChecked: false },
        { id: "discovery", label: "Discovery", isChecked: false },
        { id: "design", label: "Design", isChecked: false },
        { id: "delivery", label: "Delivery", isChecked: false },
        { id: "growth-market", label: "Growth & Market", isChecked: false },
      ]
    },
    {
      id: "keywords",
      title: "Keywords:",
      type: "tags",
      placeholder: "[Search tags...]",
      options: [
        { id: "research", label: "research", isChecked: false },
        { id: "finanse", label: "finanse", isChecked: false },
        { id: "b2b", label: "b2b", isChecked: false },
        { id: "saas", label: "saas", isChecked: false },
        { id: "design-system", label: "design-system", isChecked: false },
      ]
    }
  ]);

  const handleRemoveFilter = (id: string) => {
    const nextFilters = activeFilters.filter(f => f.id !== id);
    setActiveFilters(nextFilters);
    const nextIds = nextFilters.map(f => f.id);
    setPendingFilterIds(nextIds);
    
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

  const getFilteredProjects = (projects: readonly Project[], query: string, filterIds: string[]) => {
    return projects.filter(project => {
      const name = (project.project_name || project.name || "").toLowerCase();
      const matchesSearch = name.includes(query.toLowerCase());
      if (!matchesSearch) return false;
      if (filterIds.length === 0) return true;
      const status = (project.project_status || project.status || "").toLowerCase();
      const statusFilters = filterIds.filter(id => ["in-progress", "completed", "idea"].includes(id));
      if (statusFilters.length > 0 && !statusFilters.includes(status)) return false;
      return true;
    });
  };

  const previewResultsCount = useMemo(() => {
    return getFilteredProjects(initialProjects, searchQuery, pendingFilterIds).length;
  }, [initialProjects, searchQuery, pendingFilterIds]);

  const processedProjects = useMemo(() => {
    const appliedFilterIds = activeFilters.map(f => f.id);
    let result = getFilteredProjects(initialProjects, searchQuery, appliedFilterIds);

    result.sort((a, b) => {
      const nameA = (a.project_name || a.name || "").toLowerCase();
      const nameB = (b.project_name || b.name || "").toLowerCase();
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
  }, [initialProjects, searchQuery, sortBy, activeFilters]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col space-y-8">
        {/* Row 1: Search and Filters (Unified) */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
            <Input 
              placeholder="Search Bar" 
              className="pl-10 h-11 border-zinc-200 dark:border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-6 pb-1 px-2">
            {/* Filters Menu */}
            <FilterBigMenu 
              groups={filterGroups}
              resultsCount={previewResultsCount}
              onApply={handleApplyFilters}
              onClearAll={handleClearAll}
              onSelectionChange={setPendingFilterIds}
              trigger={
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-1">
                  <Filter size={16} />
                  Filters
                </button>
              }
            />
          </div>
        </div>

        {/* Row 2: Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Filters</span>
            <FilterBar 
              activeFilters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
            />
          </div>
        )}
      </div>

      {/* Row 3: List Header with Sort and View Toggle */}
      <div className="flex items-center justify-end gap-10 pb-2 border-b border-zinc-100 dark:border-zinc-900">
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

      <div className="pt-2">
        <ProjectList projects={processedProjects} viewMode={viewMode} />
      </div>
    </div>
  );
};
