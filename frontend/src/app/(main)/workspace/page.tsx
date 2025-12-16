import { WorkspaceView } from "@/modules/agents/features/chat-session/ui/workspace-view";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

const WorkspacePage = () => {
    // For MVP, we mock the project ID. In real app, this comes from params/context.
    const MOCK_PROJECT_ID = "00000000-0000-0000-0000-000000000000";

    return (
        <PageContainer>
            <PageHeader 
                title="Workspace" 
                description="Operations Center: Chat & Artifacts" 
            />
            <PageContent>
                <WorkspaceView projectId={MOCK_PROJECT_ID} />
            </PageContent>
        </PageContainer>
    );
};

export default WorkspacePage;