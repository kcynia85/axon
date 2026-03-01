import React from "react";
import { Layers } from "lucide-react";
import { ProjectListItemStatsProps } from "../types";
import { ProjectListItemStatsDiv } from "./ProjectListLayout";
import { ProjectStatLabel } from "./ProjectTypography";

export const ProjectListItemStats: React.FC<ProjectListItemStatsProps> = ({ 
    artifactsCount 
}) => {
    return (
        <ProjectListItemStatsDiv>
            <Layers size={14} />
            <ProjectStatLabel>{artifactsCount}</ProjectStatLabel>
        </ProjectListItemStatsDiv>
    );
};
