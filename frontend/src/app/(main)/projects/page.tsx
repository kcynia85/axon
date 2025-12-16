import { getProjects, ProjectList } from "@/modules/projects";
import { CreateProjectDialog } from "@/modules/projects/features/browse-projects/ui/create-project-dialog";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

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
