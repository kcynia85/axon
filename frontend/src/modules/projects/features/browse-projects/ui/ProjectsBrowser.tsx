'use client';

import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { Button } from "@/shared/ui/ui/Button";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { ProjectList } from "./ProjectList";
import { Project } from "../../../domain";

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
  
  // Active filters bar state
  const [activeFilters, setActiveFilters] = useState<readonly ActiveFilter[]>([
    { id: "in-progress", label: "In Progress", category: "status" },
    { id: "completed", label: "Completed", category: "status" }
  ]);

  // Big menu filter groups state
  const [filterGroups, setFilterGroups] = useState<readonly FilterGroup[]>([
    {
      id: "workspaces",
      title: "Workspaces:",
      options: [
        { id: "global", label: "Global", isChecked: true },
        { id: "product-mgmt", label: "Product Management", isChecked: true },
        { id: "discovery", label: "Discovery", isChecked: false },
        { id: "design", label: "Design", isChecked: true },
        { id: "delivery", label: "Delivery", isChecked: false },
        { id: "growth-market", label: "Growth & Market", isChecked: false },
      ]
    }
  ]);

  const handleRemoveFilter = (id: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== id));
    setFilterGroups(prev => prev.map(group => ({
      ...group,
      options: group.options.map(opt => 
        opt.id === id ? { ...opt, isChecked: false } : opt
      )
    })));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setFilterGroups(prev => prev.map(group => ({
      ...group,
      options: group.options.map(opt => ({ ...opt, isChecked: false }))
    })));
  };

  const handleApplyFilters = (selectedIds: string[]) => {
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

  const processedProjects = useMemo(() => {
    // 1. Filter
    let result = [...initialProjects].filter(project => {
      const name = project.project_name || project.name || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // 2. Sort
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
  }, [initialProjects, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
            <Input 
              placeholder="Search Bar" 
              className="pl-10 h-11 border-zinc-200 dark:border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {/* Filters Menu */}
            <FilterBigMenu 
              groups={filterGroups}
              onApply={handleApplyFilters}
              onClearAll={handleClearAll}
              trigger={
                <Button 
                  variant="outline" 
                  className="h-11 border-zinc-200 dark:border-zinc-800 flex gap-2"
                >
                  <Filter size={18} />
                  Filters
                </Button>
              }
            />

            {/* Sort Menu */}
            <SortMenu 
              options={SORT_OPTIONS}
              activeOptionId={sortBy}
              onSelect={setSortBy}
              trigger={
                <Button 
                  variant="outline" 
                  className="h-11 border-zinc-200 dark:border-zinc-800 flex gap-2"
                >
                  <ArrowUpDown size={18} />
                  Sort
                </Button>
              }
            />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Aktywne Filtry</span>
          <FilterBar 
            activeFilters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        </div>
      </div>

      <div className="pt-4">
        <ProjectList projects={processedProjects} />
      </div>
    </div>
  );
};
