'use client';

import React, { useState, useEffect } from "react";
import { Filter, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { SortOption } from "@/shared/domain/filters";
import { ProjectList } from "./ProjectList";
import { Project, Artifact } from "../../../domain";
import { cn } from "@/shared/lib/utils";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { ProjectDetailsView } from "../../project-details/ui/ProjectDetailsView";
import { getProjectArtifacts } from "../../project-details/infrastructure/api";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";
import { FilterPill } from "@/shared/ui/complex/FilterPill";

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
  const [viewMode, setViewMode] = useViewMode("projects", "grid");
  
  // Sidebar State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const filterItems = (items: readonly Project[], query: string, filterIds: string[]) => {
    return items.filter(project => {
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

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFilters,
    filterGroups,
    handleToggleFilter,
    handleRemoveFilter,
    handleClearAll,
    handleApplyFilters,
    getFilteredItems,
    getPreviewCount,
    setPendingFilterIds,
  } = useResourceFilters<Project>({
    filterItems,
    initialFilterGroups: [
      {
        id: "status",
        title: "Status:",
        type: "checkbox",
        options: [
          { id: "in-progress", label: "In Progress", isChecked: false },
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
        ]
      }
    ]
  });

  // Fetch artifacts when a project is selected
  useEffect(() => {
    if (selectedProject) {
        getProjectArtifacts(selectedProject.id).then(setArtifacts);
    }
  }, [selectedProject]);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setActiveTab("overview");
    setIsSidebarOpen(true);
  };

  const processedProjects = getFilteredItems(initialProjects).sort((a, b) => {
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

  return (
    <>
      <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search projects..."
        activeFilters={activeFilters.length > 0 && (
          <FilterBar 
            activeFilters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        )}
        filters={
          <>
            <FilterPill 
              label="By Workspace" 
              group={filterGroups.find(g => g.id === 'workspaces')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
            />
            <FilterPill 
              label="By Status" 
              group={filterGroups.find(g => g.id === 'status')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
            />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
            <FilterBigMenu 
              groups={filterGroups}
              resultsCount={getPreviewCount(initialProjects)}
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
          </>
        }
        actions={
          <>
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
          </>
        }
      >
        <ProjectList projects={processedProjects} viewMode={viewMode} onViewDetails={handleViewDetails} />
      </BrowserLayout>

      {/* Project Details Sidebar */}
      <SidePeek 
        title={selectedProject?.project_name || "Project Details"}
        open={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen}
      >
        {selectedProject && (
            <ProjectDetailsView 
                project={selectedProject} 
                artifacts={artifacts} 
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        )}
      </SidePeek>
    </>
  );
};
