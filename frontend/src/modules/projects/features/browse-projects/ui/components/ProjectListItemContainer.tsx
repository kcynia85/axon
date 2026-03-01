import React from "react";
import { ProjectListItemContainerProps } from "../types";
import { ProjectListItemContainerDiv } from "./ProjectListLayout";

export const ProjectListItemContainer: React.FC<ProjectListItemContainerProps> = ({ children }) => {
    return (
        <ProjectListItemContainerDiv>
            {children}
        </ProjectListItemContainerDiv>
    );
};
