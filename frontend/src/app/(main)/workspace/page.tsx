import { WorkspaceView } from "@/modules/agents/features/chat-session/ui/workspace-view";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { getProjects } from "@/modules/projects";

const WorkspacePage = async () => {
    // Fetch real projects for full integration
    const projects = await getProjects();
    const activeProject = projects[0];

    if (!activeProject) {
        return (
             <PageContainer>
                <PageHeader 
                    title="Workspace" 
                    description="Operations Center: Chat & Artifacts" 
                />
                <PageContent>
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p>No projects found. Please create a project in the Projects section to use the Workspace.</p>
                    </div>
                </PageContent>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader 
                title="Workspace" 
                description={`Operations Center: ${activeProject.name}`}
            />
            <PageContent>
                <WorkspaceView projectId={activeProject.id} />
            </PageContent>
        </PageContainer>
    );
};

export default WorkspacePage;