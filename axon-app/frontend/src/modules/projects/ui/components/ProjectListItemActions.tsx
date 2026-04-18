import React from "react";
import { ProjectListItemActionsProps } from "../types";
import { ProjectListItemActionsDiv } from "./ProjectListLayout";
import { ProjectActionOpenSpace, ProjectActionDetails } from "./ProjectActionAtoms";

export const ProjectListItemActions = ({ 
    spaceUrl, 
    onViewDetails 
}: ProjectListItemActionsProps) => {
    return (
        <ProjectListItemActionsDiv>
            <ProjectActionOpenSpace href={spaceUrl} />
            <ProjectActionDetails onClick={onViewDetails} />
        </ProjectListItemActionsDiv>
    );
};
