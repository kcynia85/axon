import React from "react";
import { Project } from "../../../domain";
import { ProjectCard } from "./ProjectCard";
import { ProjectListItem } from "./ProjectListItem";

export type ViewMode = 'grid' | 'list';

interface ProjectListProps {
    readonly projects: readonly Project[];
    readonly viewMode?: ViewMode;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, viewMode = 'grid' }) => {
    if (projects.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <p className="text-muted-foreground">No projects found. Create one to get started.</p>
            </div>
        );
    }

    if (viewMode === 'list') {
        return (
            <div className="flex flex-col gap-3">
                {projects.map((project) => (
                    <ProjectListItem key={project.id} project={project} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
};
