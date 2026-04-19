"use client";

import { useProjectDetailsQuery } from "@/modules/projects/application/hooks";
import { ProjectStudio } from "./ProjectStudio";
import { mapProjectToFormData } from "@/modules/projects/ui/mappers/ProjectViewModelMapper";

interface ProjectStudioContainerProps {
    projectId: string;
}

export const ProjectStudioContainer = ({ projectId }: ProjectStudioContainerProps) => {
    const { data: project, isLoading, isError } = useProjectDetailsQuery(projectId);

    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Ładowanie...</div>;
    }

    if (isError || !project) {
        return <div className="flex h-screen w-full items-center justify-center text-red-500 font-mono text-sm tracking-widest uppercase">Błąd podczas ładowania projektu.</div>;
    }

    const initialData = mapProjectToFormData(project);

    return <ProjectStudio initialData={initialData} projectId={projectId} />;
};
