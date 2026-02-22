import { getProjects, ProjectList } from "@/modules/projects";
import { CreateProjectDialog } from "@/modules/projects/features/browse-projects/ui/CreateProjectDialog";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";

const ProjectsPage = async () => {
    const projects = await getProjects();

    return (
        <PageContainer>
            <PageHeader 
                title="All Projects" 
                description="Browse and manage all your ongoing initiatives." 
            >
                <CreateProjectDialog />
            </PageHeader>
            <PageContent>
                <ProjectList projects={projects} />
            </PageContent>
        </PageContainer>
    );
};

export default ProjectsPage;
