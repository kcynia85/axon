import { getProjects, ProjectList } from "@/modules/projects";
import { CreateProjectDialog } from "@/modules/projects/features/browse-projects/ui/create-project-dialog";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

const DashboardPage = async () => {
    const projects = await getProjects();

    return (
        <PageContainer>
            <PageHeader 
                title="Dashboard" 
                description="Manage your AI-powered projects." 
            >
                <CreateProjectDialog />
            </PageHeader>
            <PageContent>
                <ProjectList projects={projects} />
            </PageContent>
        </PageContainer>
    );
};

export default DashboardPage;