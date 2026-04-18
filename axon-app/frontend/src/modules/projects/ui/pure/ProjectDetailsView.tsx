'use client';

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { ProjectDetailsViewProps } from "../types";
import { ProjectDetailsContainer } from "../components/ProjectDetailsLayout";
import { ProjectOverviewTab } from "../components/ProjectOverviewTab";
import { ProjectResourcesTab } from "../components/ProjectResourcesTab";
import { ProjectArtifactsTab } from "../components/ProjectArtifactsTab";
import { ProjectActivityTab } from "../components/ProjectActivityTab";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";

/**
 * ProjectDetailsView - Pure presentation component for project details.
 * Strictly 0% business logic, 0% state.
 */
export const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({ 
    project, 
    viewModel,
    artifactViewModels,
    activeTab = "overview", 
    onTabChange,
    isLoadingArtifacts = false,
    isDeleteModalOpen,
    isDeleting,
    onOpenDeleteModal,
    onCloseDeleteModal,
    onConfirmDeletion
}) => {
    return (
        <>
            <ProjectDetailsContainer>
                <Tabs value={activeTab} onValueChange={onTabChange} className="w-full flex-1">
                    <TabsList className="flex bg-transparent border-b border-zinc-100 dark:border-zinc-900 rounded-none h-auto p-0 mb-6 gap-6 overflow-x-auto overflow-y-hidden scrollbar-none border-none! shadow-none!">
                        {[
                            { id: "overview", label: "Overview" },
                            { id: "resources", label: "Key resources" },
                            { id: "artifacts", label: "Artefakty" },
                            { id: "activity", label: "Activity" }
                        ].map((tab) => (
                            <TabsTrigger 
                                key={tab.id}
                                value={tab.id} 
                                className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-transparent! data-[state=active]:shadow-none! px-0 pb-3 text-[11px] font-bold transition-all whitespace-nowrap"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="overview">
                        <ProjectOverviewTab 
                            viewModel={viewModel}
                            onDelete={onOpenDeleteModal}
                            isDeleting={isDeleting}
                        />
                    </TabsContent>

                    <TabsContent value="resources">
                        <ProjectResourcesTab 
                            keyResources={project.key_resources || []}
                        />
                    </TabsContent>

                    <TabsContent value="artifacts">
                        <ProjectArtifactsTab 
                            artifacts={artifactViewModels}
                            isLoading={isLoadingArtifacts}
                        />
                    </TabsContent>

                    <TabsContent value="activity">
                        <ProjectActivityTab />
                    </TabsContent>
                </Tabs>
            </ProjectDetailsContainer>

            <DestructiveDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={onCloseDeleteModal}
                onConfirm={onConfirmDeletion}
                title="Delete Project"
                resourceName={project.project_name || project.name || "this project"}
                affectedResources={[]}
                isLoading={isDeleting}
            />
        </>
    );
};
