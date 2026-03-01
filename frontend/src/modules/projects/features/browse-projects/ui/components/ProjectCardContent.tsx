import React from "react";
import { CardContent } from "@/shared/ui/ui/Card";
import { Layers } from "lucide-react";
import { ProjectCardContentProps } from "../types";
import { ProjectCardTagsGroup, ProjectCardStatsGroup } from "./ProjectCardLayout";
import { ProjectTagText } from "./ProjectTypography";

export const ProjectCardContent: React.FC<ProjectCardContentProps> = ({ 
    tags = [], 
    artifactsCount 
}) => {
    return (
        <CardContent className="flex-1 space-y-4">
            <ProjectCardTagsGroup>
                {(tags || []).map((tag: string, i: number) => (
                    <ProjectTagText key={i}>{tag}</ProjectTagText>
                ))}
            </ProjectCardTagsGroup>

            <ProjectCardStatsGroup>
                <Layers size={16} />
                Artifacts: {artifactsCount}
            </ProjectCardStatsGroup>
        </CardContent>
    );
};
