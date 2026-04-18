import { getProjectDetails, getProjectArtifacts, ProjectDetails } from "@/modules/projects";
import { notFound } from "next/navigation";

type PageProps = {
    readonly params: Promise<{ id: string }>;
    readonly searchParams: Promise<{ tab?: string }>;
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
            <ProjectDetails project={project} artifacts={artifacts} activeTab={tab} />
        </div>
    );
}
