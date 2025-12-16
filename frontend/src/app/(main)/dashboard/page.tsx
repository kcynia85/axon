import { getProjects, ProjectList } from "@/modules/projects";
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
            />
            <PageContent>
                <ProjectList projects={projects} />
            </PageContent>
        </PageContainer>
    );
};

export default DashboardPage;