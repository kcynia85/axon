"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { useProjectArtifactsQuery } from "@/modules/projects/application/hooks";
import { useSpaces } from "@/modules/spaces/application/hooks";
import { ProjectArtifactsTab } from "@/modules/projects/ui/components/ProjectArtifactsTab";
import { mapArtifactToViewModel } from "@/modules/projects/ui/mappers/ProjectViewModelMapper";

export const ArtefactsSection = ({ projectId }: { projectId?: string }) => {
    const { watch } = useFormContext();
    const spaceIds: string[] = watch("spaceIds") || [];
    
    const { data: spaces = [] } = useSpaces();
    const selectedSpaces = spaces.filter((space) => spaceIds.includes(space.id));

    const { data: artifacts = [], isLoading } = useProjectArtifactsQuery(projectId || null);

    const artifactViewModels = artifacts.map(mapArtifactToViewModel);

    return (
        <FormSection id="ARTEFACTS" number={4} title="Artefakty" variant="island">
            <div className="w-full">
                <ProjectArtifactsTab 
                    artifacts={artifactViewModels} 
                    isLoading={isLoading} 
                    spaces={selectedSpaces}
                />
            </div>
        </FormSection>
    );
};
