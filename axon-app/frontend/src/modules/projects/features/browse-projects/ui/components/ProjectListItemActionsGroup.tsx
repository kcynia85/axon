import React from "react";
import { ProjectListItemActionsGroupProps } from "../types";
import { ProjectListItemActionsGroupDiv } from "./ProjectListLayout";

export const ProjectListItemActionsGroup: React.FC<ProjectListItemActionsGroupProps> = ({ children }) => {
    return (
        <ProjectListItemActionsGroupDiv>
            {children}
        </ProjectListItemActionsGroupDiv>
    );
};
