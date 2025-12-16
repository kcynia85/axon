import { WorkflowList } from "@/modules/workflows/features/manage-workflows/ui/workflow-list";
import { getWorkflows } from "@/modules/workflows/features/manage-workflows/infrastructure/api";
import { CreateWorkflowDialog } from "@/modules/workflows/features/manage-workflows/ui/create-workflow-dialog";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

const WorkflowsPage = async () => {
    // Fetch all user workflows (projectId undefined = all)
    const workflows = await getWorkflows();

    return (
        <PageContainer>
            <PageHeader 
                title="Workflows" 
                description="Automate your research and content pipelines."
            >
                <CreateWorkflowDialog />
            </PageHeader>
            <PageContent>
                <WorkflowList items={workflows} />
            </PageContent>
        </PageContainer>
    );
};

export default WorkflowsPage;