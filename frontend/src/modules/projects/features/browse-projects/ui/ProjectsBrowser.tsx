'use client';

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption } from "@/shared/domain/filters";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { ProjectDetailsView } from "../../project-details/ui/ProjectDetailsView";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useProjectsBrowser } from "../application/useProjectsBrowser";
import { ProjectsBrowserProps } from "./types";
import { ProjectsFilterSection } from "./components/ProjectsFilterSection";
import { ProjectsActionsSection } from "./components/ProjectsActionsSection";
import { ProjectsBrowserContent } from "./components/ProjectsBrowserContent";
import { RecentlyUsedProjects } from "./RecentlyUsedProjects";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

export const ProjectsBrowser = ({ initialProjects = [] }: ProjectsBrowserProps) => {
  const {
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
  } = useProjectsBrowser(initialProjects);

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
    getPreviewCount,
    setPendingFilterIds,
  } = filterConfig;

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
        topContent={
          <RecentlyUsedProjects 
            projects={recentlyUsedViewModels} 
            onSelect={handleViewDetails} 
          />
        }
        filters={
          <ProjectsFilterSection 
            filterGroups={filterGroups}
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
            onApplyFilters={handleApplyFilters}
            onClearAll={handleClearAll}
            onPendingFilterIdsChange={setPendingFilterIds}
            resultsCount={getPreviewCount(projects)}
          />
        }
        actions={
          <ProjectsActionsSection 
            sortBy={sortBy}
            onSortByChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortOptions={SORT_OPTIONS}
          />
        }
      >
        <ProjectsBrowserContent 
            projects={processedProjectViewModels}
            viewMode={viewMode}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            isError={isError}
        />
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
                isLoadingArtifacts={isLoadingArtifacts}
            />
        )}
      </SidePeek>
    </>
  );
};
