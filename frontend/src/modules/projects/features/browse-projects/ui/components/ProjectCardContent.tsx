import React from "react";
import { CardContent } from "@/shared/ui/ui/Card";
import { Layers } from "lucide-react";
import { ProjectCardContentProps } from "../types";
import { 
    ProjectCardTagsGroup, 
    ProjectCardStatsGroup,
    ProjectCardContentLayout
} from "./ProjectCardLayout";
import { ProjectTagText } from "./ProjectTypography";
import { Tooltip } from "@/shared/ui/ui/Tooltip";

export const ProjectCardContent: React.FC<ProjectCardContentProps> = ({ 
    tags = [], 
    artifactsCount 
}) => {
    return (
        <CardContent className="flex-1 pt-2 pb-6">
            <ProjectCardContentLayout>
                <ProjectCardTagsGroup>
                    {(tags || []).map((tag: string, i: number) => (
                        <ProjectTagText key={i}>{tag}</ProjectTagText>
                    ))}
                </ProjectCardTagsGroup>

                <Tooltip content="Generated Artifacts" side="top">
                    <ProjectCardStatsGroup>
                        <Layers size={14} className="opacity-60" />
                        <span className="text-[12px] tabular-nums uppercase tracking-widest font-black opacity-60">
                            {artifactsCount}
                        </span>
                    </ProjectCardStatsGroup>
                </Tooltip>
            </ProjectCardContentLayout>
        </CardContent>
    );
};
