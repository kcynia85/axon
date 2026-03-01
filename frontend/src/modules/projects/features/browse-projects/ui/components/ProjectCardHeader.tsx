import React from "react";
import { CardHeader } from "@/shared/ui/ui/Card";
import { StatusBadge } from "@/shared/ui/complex/StatusBadge";
import { ProjectCardHeaderProps } from "../types";
import { ProjectCardTitle } from "./ProjectTypography";

export const ProjectCardHeader: React.FC<ProjectCardHeaderProps> = ({ 
    title, 
    statusLabel, 
    statusVariant 
}) => {
    return (
        <CardHeader className="pb-4 pt-6 flex flex-col items-start gap-4">
            {/* Title Block - Fixed height to ensure status alignment across cards */}
            <div className="min-h-[56px] w-full flex items-start">
                <ProjectCardTitle>{title}</ProjectCardTitle>
            </div>
            
            {/* Status Block - Dedicated container for consistent vertical positioning */}
            <div className="flex items-center h-6">
                <StatusBadge status={statusLabel} variant={statusVariant} />
            </div>
        </CardHeader>
    );
};
