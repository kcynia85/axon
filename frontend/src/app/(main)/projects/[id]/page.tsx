import { getProjectDetails, getProjectArtifacts } from "@/modules/projects/features/project-details/infrastructure/api";
import { ProjectDetailsView } from "@/modules/projects/features/project-details/ui/ProjectDetailsView";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ tab?: string }>;
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { tab = "overview" } = await searchParams;
    const project = await getProjectDetails(id);
    
    if (!project) {
        notFound();
    }

    const artifacts = await getProjectArtifacts(id);

    return (
        <div className="container mx-auto py-10 px-4">
            <ProjectDetailsView project={project} artifacts={artifacts} activeTab={tab} />
        </div>
    );
}