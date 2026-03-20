import { useState, useMemo } from "react";
import { Project } from "@/modules/projects/domain";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";
import { useProjectsQuery, useProjectArtifactsQuery } from "./hooks";
import { mapProjectToViewModel } from "../ui/mappers/ProjectViewModelMapper";

export const useProjectsBrowser = (initialProjects: readonly Project[] = []) => {
  const [viewMode, setViewMode] = useViewMode("projects", "grid");
  
  // Data Fetching
  const { data: projects = initialProjects, isLoading, isError } = useProjectsQuery();
  
  // Sidebar State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: artifacts = [], isLoading: isLoadingArtifacts } = useProjectArtifactsQuery(selectedProjectId);

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId) || null,
  [projects, selectedProjectId]);

  const filterItems = (items: readonly Project[], query: string, filterIds: string[]) => {
    return items.filter(project => {
      const name = (project.project_name || project.name || "").toLowerCase();
      const matchesSearch = name.includes(query.toLowerCase());
      if (!matchesSearch) return false;
      if (filterIds.length === 0) return true;
      
      const status = (project.project_status || project.status || "").toLowerCase();
      const statusFilters = filterIds.filter(id => ["in_progress", "done", "idea", "review", "archived"].includes(id));
      if (statusFilters.length > 0 && !statusFilters.includes(status)) return false;
      
      return true;
    });
  };

  const filterConfig = useResourceFilters<Project>({
    filterItems,
    initialFilterGroups: [
      {
        id: "status",
        title: "Status:",
        type: "checkbox",
        options: [
          { id: "in_progress", label: "In Progress", isChecked: false },
          { id: "done", label: "Completed", isChecked: false },
          { id: "idea", label: "Idea", isChecked: false },
          { id: "review", label: "Review", isChecked: false },
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

  const handleViewDetails = (id: string) => {
    setSelectedProjectId(id);
    setActiveTab("overview");
    setIsSidebarOpen(true);
  };

  const processedProjectViewModels = useMemo(() => {
    return filterConfig.getFilteredItems(projects)
      .sort((a, b) => {
        const nameA = (a.project_name || a.name || "").toLowerCase();
        const nameB = (b.project_name || b.name || "").toLowerCase();
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();

        switch (filterConfig.sortBy) {
          case "name-asc": return nameA.localeCompare(nameB);
          case "name-desc": return nameB.localeCompare(nameA);
          case "date-asc": return dateA - dateB;
          case "date-desc": return dateB - dateA;
          default: return 0;
        }
      })
      .map(mapProjectToViewModel);
  }, [projects, filterConfig]);

  const recentlyUsedViewModels = useMemo(() => {
      return projects.slice(0, 3).map(mapProjectToViewModel);
  }, [projects]);

  return {
    projects,
    processedProjectViewModels,
    recentlyUsedViewModels,
    viewMode,
    setViewMode,
    isLoading,
    isError,
    selectedProject,
    artifacts,
    isLoadingArtifacts,
    isSidebarOpen,
    setIsSidebarOpen,
    activeTab,
    setActiveTab,
    handleViewDetails,
    filterConfig
  };
};
