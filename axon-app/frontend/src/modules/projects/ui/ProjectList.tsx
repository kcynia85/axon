import React from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectListItem } from "./components/ProjectListItem";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { ProjectListProps } from "./types";

export const ProjectList = ({ 
    projects, 
    viewMode = 'grid', 
    isLoading = false,
    isError = false,
    onViewDetails 
}: ProjectListProps) => {
    return (
        <ResourceList
            items={projects}
            isLoading={isLoading}
            isError={isError}
            viewMode={viewMode}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
            emptyTitle="No projects found"
            emptyDescription="Create one to get started."
            renderItem={(projectViewModel) => (
                viewMode === 'grid' ? (
                    <ProjectCard viewModel={projectViewModel} onViewDetails={onViewDetails} />
                ) : (
                    <ProjectListItem viewModel={projectViewModel} onViewDetails={onViewDetails} />
                )
            )}
        />
    );
};
