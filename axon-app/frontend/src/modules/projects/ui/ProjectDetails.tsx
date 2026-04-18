"use client";

import React from "react";
import { ProjectDetailsView } from "./pure/ProjectDetailsView";
import { ProjectDetailsViewProps } from "./types";
import { useProjectDetailsInteraction } from "@/modules/projects/application/useProjectDetailsInteraction";
import { mapProjectToViewModel, mapArtifactToViewModel } from "@/modules/projects/ui/mappers/ProjectViewModelMapper";
import { Project, Artifact } from "../domain";

type ProjectDetailsContainerProperties = {
    readonly project: Project;
    readonly artifacts: readonly Artifact[];
    readonly activeTab?: string;
    readonly onTabChange?: (tab: string) => void;
    readonly isLoadingArtifacts?: boolean;
};

/**
 * ProjectDetails - Container component for project details.
 * Orchestrates data mapping and interaction logic.
 */
export const ProjectDetails = ({
    project,
    artifacts,
    activeTab = "overview",
    onTabChange,
    isLoadingArtifacts = false
}: ProjectDetailsContainerProperties) => {
    const {
        isDeleteModalOpen,
        isDeleting,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleConfirmDeletion,
        handleTabChange
    } = useProjectDetailsInteraction({
        projectIdentifier: project.id,
        initialTab: activeTab,
        onTabChange
    });

    const viewModel = mapProjectToViewModel(project);
    const artifactViewModels = artifacts.map(mapArtifactToViewModel);

    return (
        <ProjectDetailsView 
            project={project}
            viewModel={viewModel}
            artifactViewModels={artifactViewModels}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isLoadingArtifacts={isLoadingArtifacts}
            isDeleteModalOpen={isDeleteModalOpen}
            isDeleting={isDeleting}
            onOpenDeleteModal={handleOpenDeleteModal}
            onCloseDeleteModal={handleCloseDeleteModal}
            onConfirmDeletion={handleConfirmDeletion}
        />
    );
};
