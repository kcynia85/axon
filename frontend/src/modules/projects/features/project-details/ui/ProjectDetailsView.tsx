'use client';

import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { useDeleteProjectMutation } from "../../browse-projects/application/hooks";
import { mapProjectToViewModel, mapArtifactToViewModel } from "../../browse-projects/ui/mappers/ProjectViewModelMapper";
import { ProjectDetailsViewProps } from "./types";
import { ProjectDetailsContainer } from "./ProjectDetailsLayout";
import { ProjectOverviewTab } from "./ProjectOverviewTab";
import { ProjectResourcesTab } from "./ProjectResourcesTab";
import { ProjectArtifactsTab } from "./ProjectArtifactsTab";
import { ProjectActivityTab } from "./ProjectActivityTab";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";

export const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({ 
    project, 
    artifacts, 
    activeTab = "overview", 
    onTabChange,
    isLoadingArtifacts = false
}) => {
    const { mutate: deleteProject, isPending: isDeleting } = useDeleteProjectMutation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

    const viewModel = useMemo(() => mapProjectToViewModel(project), [project]);
    const artifactViewModels = useMemo(() => artifacts.map(mapArtifactToViewModel), [artifacts]);

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        deleteProject(project.id);
        setIsDeleteModalOpen(false);
    };

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
                            onDelete={handleDelete}
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
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Project"
                resourceName={project.name || "this project"}
                affectedResources={[]}
                isLoading={isDeleting}
            />
        </>
    );
};
