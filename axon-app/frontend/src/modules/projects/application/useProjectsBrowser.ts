import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/modules/projects/domain";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";
import { useProjectsQuery, useDeleteProjectMutation } from "./hooks";
import { mapProjectToViewModel } from "../ui/mappers/ProjectViewModelMapper";
import { SortOption } from "@/shared/domain/filters";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";

export const useProjectsBrowser = (initialProjects: readonly Project[] = []) => {
  const { workspace: workspaceId } = useParams<{ workspace: string }>();
  const router = useRouter();
  const [viewMode, setViewMode] = useViewMode("projects", "grid");
  
  // Data Fetching
  const { data: projects = initialProjects, isLoading, isError } = useProjectsQuery();
  const { mutate: deleteProject } = useDeleteProjectMutation();
  const { deleteWithUndo } = useDeleteWithUndo();
  
  // Sidebar State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derived state - React Compiler handles optimization
  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  const filterItems = (items: readonly Project[], query: string, filterIds: string[]) => {
    return items.filter(project => {
      const name = (project.project_name || project.name || "").toLowerCase();
      const matchesSearch = name.includes(query.toLowerCase());
      if (!matchesSearch) return false;
      if (filterIds.length === 0) return true;
      
      const status = project.project_status || project.status || "";
      const statusFilters = filterIds.filter(id => ["Idea", "In Progress", "Completed", "Review", "Archived"].includes(id));
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
          { id: "In Progress", label: "In Progress", isChecked: false },
          { id: "Completed", label: "Completed", isChecked: false },
          { id: "Idea", label: "Idea", isChecked: false },
          { id: "Review", label: "Review", isChecked: false },
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
    setIsSidebarOpen(true);
  };

  const handleConfigure = (id: string) => {
    if (workspaceId) {
      router.push(`/workspaces/${workspaceId}/projects/studio/${id}`);
    } else {
      router.push(`/projects/studio/${id}`);
    }
  };

  const handleDelete = (id: string) => {
    const project = projects.find(p => p.id === id);
    const name = project?.project_name || project?.name || "Projekt";
    deleteWithUndo(id, name, () => deleteProject(id));
    if (selectedProjectId === id) {
        setIsSidebarOpen(false);
        setSelectedProjectId(null);
    }
  };

  // Derived state - React Compiler handles optimization
  const filteredProjects = filterConfig.getFilteredItems(projects);
  
  filteredProjects.sort((a, b) => {
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
  });

  const processedProjectViewModels = filteredProjects.map(mapProjectToViewModel);
  const recentlyUsedViewModels = projects.slice(0, 3).map(mapProjectToViewModel);

  return {
    projects,
    processedProjectViewModels,
    recentlyUsedViewModels,
    viewMode,
    setViewMode,
    isLoading,
    isError,
    selectedProject,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    handleConfigure,
    handleDelete,
    filterConfig
  };
};
