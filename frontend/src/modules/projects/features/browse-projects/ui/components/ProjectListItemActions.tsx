import React from "react";
import { ProjectListItemActionsProps } from "../types";
import { ProjectListItemActionsDiv } from "./ProjectListLayout";
import { ProjectActionOpenSpace, ProjectActionDetails } from "./ProjectActionAtoms";

export const ProjectListItemActions: React.FC<ProjectListItemActionsProps> = ({ 
    projectId, 
    onViewDetails 
}) => {
    return (
        <ProjectListItemActionsDiv>
            <ProjectActionOpenSpace href={`/projects/${projectId}/space`} />
            <ProjectActionDetails onClick={() => onViewDetails(projectId)} />
        </ProjectListItemActionsDiv>
    );
};
