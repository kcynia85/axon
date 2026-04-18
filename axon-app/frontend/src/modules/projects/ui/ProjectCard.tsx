import React from "react";
import { MainCard, MainCardHeader, MainCardContent, MainCardFooter } from "@/shared/ui/complex/MainCard";
import { ProjectCardProps } from "./types";
import { StatusBadge } from "@/shared/ui/complex/StatusBadge";
import { ProjectCardContent } from "./components/ProjectCardContent";

export const ProjectCard = ({ viewModel, onViewDetails }: ProjectCardProps) => {
    return (
        <MainCard onClick={() => onViewDetails(viewModel.id)}>
            <MainCardHeader title={viewModel.title}>
                <StatusBadge status={viewModel.statusLabel} variant={viewModel.statusVariant} />
            </MainCardHeader>

            <MainCardContent>
                <ProjectCardContent 
                    tags={viewModel.displayTags}
                    artifactsCount={viewModel.artifactsCount}
                />
            </MainCardContent>

            <MainCardFooter label="View Details" />
        </MainCard>
    );
};

