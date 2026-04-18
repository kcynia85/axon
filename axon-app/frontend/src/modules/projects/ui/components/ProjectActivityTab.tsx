import React from "react";
import { ProjectActivityTabProps } from "../types";
import { ProjectDetailsContentGroup } from "./ProjectDetailsLayout";
import { BaseDiv, BaseParagraph, BaseHeading3 } from "./ProjectBaseAtoms";

export const ProjectActivityTab: React.FC<ProjectActivityTabProps> = () => {
    return (
        <ProjectDetailsContentGroup>
            <BaseDiv className="space-y-2">
                <BaseHeading3 className="text-sm font-bold text-zinc-400">Timeline of changes</BaseHeading3>
                <BaseParagraph className="text-xs text-zinc-500 italic">No activity recorded yet.</BaseParagraph>
            </BaseDiv>
        </ProjectDetailsContentGroup>
    );
};
