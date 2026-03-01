import React from "react";
import { CardHeader } from "@/shared/ui/ui/Card";
import { StatusBadge } from "@/shared/ui/complex/StatusBadge";
import { ProjectCardHeaderProps } from "../types";
import { ProjectCardTitleGroup } from "./ProjectCardLayout";
import { ProjectCardTitle } from "./ProjectTypography";

export const ProjectCardHeader: React.FC<ProjectCardHeaderProps> = ({ 
    title, 
    statusLabel, 
    statusVariant 
}) => {
    return (
        <CardHeader className="pb-2">
            <ProjectCardTitleGroup>
                <StatusBadge status={statusLabel} variant={statusVariant} />
                <ProjectCardTitle>{title}</ProjectCardTitle>
            </ProjectCardTitleGroup>
        </CardHeader>
    );
};
