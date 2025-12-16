import { AgentList, getAgents } from "@/modules/agents";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

const AgentsPage = async () => {
    const agents = await getAgents();

    return (
        <PageContainer>
            <PageHeader 
                title="Agent Configuration" 
                description="Manage your AI workforce, assign tools, and configure models." 
            />
            <PageContent>
                <AgentList agents={agents} />
            </PageContent>
        </PageContainer>
    );
};

export default AgentsPage;
