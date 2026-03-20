import React from "react";
import { ProjectList } from "../ProjectList";
import { ProjectsBrowserContentProps } from "../types";
import { ProjectsBrowserLayoutContainer } from "./ProjectsBrowserLayout";

export const ProjectsBrowserContent: React.FC<ProjectsBrowserContentProps> = ({
    projects,
    viewMode,
    onViewDetails,
    isLoading,
    isError
}) => {
    return (
        <ProjectsBrowserLayoutContainer>
            <ProjectList 
                projects={projects} 
                viewMode={viewMode} 
                onViewDetails={onViewDetails}
                isLoading={isLoading}
                isError={isError} 
            />
        </ProjectsBrowserLayoutContainer>
    );
};
