import React from "react";
import { ProjectResourcesTabProps } from "./types";
import { ProjectDetailsContentGroup, ProjectDetailsLink } from "./ProjectDetailsLayout";
import { ProjectDetailsAddResourceButton } from "./ProjectDetailsAtoms";
import { BaseDiv } from "../../browse-projects/ui/components/ProjectBaseAtoms";
import { KeyResource } from "@/modules/projects/domain";

export const ProjectResourcesTab: React.FC<ProjectResourcesTabProps> = ({ keyResources }) => {
    const defaultResources: Partial<KeyResource>[] = [
        { id: '1', resource_label: 'Project notion strategy', resource_url: '#' },
        { id: '2', resource_label: 'Design system figma', resource_url: '#' }
    ];

    const resources = keyResources.length > 0 ? keyResources : defaultResources;

    return (
        <ProjectDetailsContentGroup>
            <BaseDiv className="flex flex-col space-y-3">
                {resources.map((res) => (
                    <ProjectDetailsLink key={res.id} href={res.resource_url || "#"}>
                        {res.resource_label}
                    </ProjectDetailsLink>
                ))}
            </BaseDiv>

            <ProjectDetailsAddResourceButton />
        </ProjectDetailsContentGroup>
    );
};
