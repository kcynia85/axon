import React from "react";
import { ProjectResourcesTabProps } from "../types";
import { ProjectDetailsContentGroup, ProjectDetailsLink } from "./ProjectDetailsLayout";
import { ProjectDetailsAddResourceButton } from "./ProjectDetailsAtoms";
import { BaseDiv } from "./ProjectBaseAtoms";
import { KeyResource } from "@/modules/projects/domain";

/**
 * ProjectResourcesTab - Presentation component for displaying project resources.
 */
export const ProjectResourcesTab: React.FC<ProjectResourcesTabProps> = ({ keyResources }) => {
    const defaultResources: Partial<KeyResource>[] = [
        { id: '1', resource_label: 'Project notion strategy', resource_url: '#' },
        { id: '2', resource_label: 'Design system figma', resource_url: '#' }
    ];

    const resourcesForDisplay = keyResources.length > 0 ? keyResources : defaultResources;

    return (
        <ProjectDetailsContentGroup>
            <BaseDiv className="flex flex-col space-y-3">
                {resourcesForDisplay.map((resource) => (
                    <ProjectDetailsLink key={resource.id} href={resource.resource_url || "#"}>
                        {resource.resource_label}
                    </ProjectDetailsLink>
                ))}
            </BaseDiv>

            <ProjectDetailsAddResourceButton />
        </ProjectDetailsContentGroup>
    );
};
