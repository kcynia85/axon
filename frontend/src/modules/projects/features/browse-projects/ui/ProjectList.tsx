import React from "react";
import { Project } from "../../../domain";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
    projects: Project[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
    if (projects.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No projects found. Create one to get started.</p>
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
