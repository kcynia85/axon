import React from "react";
import { Project } from "../../../domain";
import { ProjectCard } from "./ProjectCard";
import { ProjectListItem } from "./ProjectListItem";
import { ResourceList, ViewMode } from "@/shared/ui/complex/ResourceList";

interface ProjectListProps {
    readonly projects: readonly Project[];
    readonly viewMode?: ViewMode;
    readonly isLoading?: boolean;
    readonly isError?: boolean;
    readonly onViewDetails: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ 
    projects, 
    viewMode = 'grid', 
    isLoading = false,
    isError = false,
    onViewDetails 
}) => {
    return (
        <ResourceList
            items={projects}
            isLoading={isLoading}
            isError={isError}
            viewMode={viewMode}
            emptyTitle="No projects found"
            emptyDescription="Create one to get started."
            renderItem={(project) => (
                viewMode === 'grid' ? (
                    <ProjectCard project={project} onViewDetails={onViewDetails} />
                ) : (
                    <ProjectListItem project={project} onViewDetails={onViewDetails} />
                )
            )}
        />
    );
};
