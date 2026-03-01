import React from "react";
import { ProjectArtifactsTabProps } from "./types";
import { ProjectDetailsContentGroup, ProjectDetailsArtifactItem } from "./ProjectDetailsLayout";
import { BaseDiv, BaseSpan, BaseHeading3, BaseParagraph } from "../../browse-projects/ui/components/ProjectBaseAtoms";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { CheckCircle2, Clock } from "lucide-react";
import { ArtifactViewModel } from "../../browse-projects/ui/types";

export const ProjectArtifactsTab: React.FC<ProjectArtifactsTabProps> = ({ artifacts, isLoading }) => {
    if (isLoading) {
        return (
            <ProjectDetailsContentGroup>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </ProjectDetailsContentGroup>
        );
    }

    const defaultArtifacts: ArtifactViewModel[] = [
        { id: '1', name: 'JTBD analysis report', sourcePath: 'discovery/jtbd-research-flow', statusLabel: 'Approved', statusVariant: 'success' },
        { id: '2', name: 'Market competitive analysis', sourcePath: 'discovery/competitive-analysis-crew', statusLabel: 'Approved', statusVariant: 'success' },
        { id: '3', name: 'Product strategy document', sourcePath: 'product-mgmt/strategy-definition-flow', statusLabel: 'In review', statusVariant: 'info' }
    ];

    const displayArtifacts = artifacts.length > 0 ? artifacts : defaultArtifacts;

    return (
        <ProjectDetailsContentGroup>
            <BaseDiv className="flex items-center gap-2 text-[10px]">
                <BaseSpan className="font-bold text-zinc-400">Filtruj:</BaseSpan>
                <BaseDiv className="font-bold border-b-2 border-black dark:border-white text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer">Wszystkie</BaseDiv>
                <BaseSpan className="text-zinc-300 px-1">|</BaseSpan>
                <BaseDiv className="font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer">Discovery</BaseDiv>
            </BaseDiv>

            <BaseDiv className="flex flex-col space-y-8">
                {displayArtifacts.map((art) => (
                    <ProjectDetailsArtifactItem key={art.id}>
                        <BaseHeading3 className="text-base font-bold group-hover:underline underline-offset-4">{art.name}</BaseHeading3>
                        <BaseParagraph className="text-[10px] font-bold text-zinc-400">{art.sourcePath}</BaseParagraph>
                        <BaseDiv className="flex items-center gap-2">
                            {art.statusVariant === 'success' ? (
                                <BaseSpan className="text-[10px] font-bold text-green-600 flex items-center gap-1.5">
                                    <CheckCircle2 size={12} />
                                    {art.statusLabel}
                                </BaseSpan>
                            ) : (
                                <BaseSpan className="text-[10px] font-bold text-blue-500 flex items-center gap-1.5">
                                    <Clock size={12} />
                                    {art.statusLabel}
                                </BaseSpan>
                            )}
                        </BaseDiv>
                    </ProjectDetailsArtifactItem>
                ))}
            </BaseDiv>
        </ProjectDetailsContentGroup>
    );
};
