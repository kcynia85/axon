import React from "react";
import { Layers } from "lucide-react";
import { ProjectCardContentProps } from "../types";
import { ProjectTagText } from "./ProjectTypography";
import { Tooltip } from "@/shared/ui/ui/Tooltip";
import { BaseDiv } from "./ProjectBaseAtoms";
import { cn } from "@/shared/lib/utils";

export const ProjectCardContent = ({ 
    tags = [], 
    artifactsCount 
}: ProjectCardContentProps) => {
    const hasTags = tags && tags.length > 0;

    return (
        <BaseDiv className="flex flex-col items-start justify-start gap-4 w-full">
            {hasTags && (
                <div className="flex items-center gap-2 flex-wrap">
                    {tags.map((tag: string, i: number) => (
                        <ProjectTagText key={i}>{tag}</ProjectTagText>
                    ))}
                </div>
            )}

            <Tooltip content="Generated Artifacts" side="top">
                <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 transition-colors">
                    <Layers size={14} className="opacity-40" />
                    <span className="text-[14px] font-bold leading-none whitespace-nowrap">
                        Artefakty: <span className="ml-1">{artifactsCount}</span>
                    </span>
                </div>
            </Tooltip>
        </BaseDiv>
    );
};
