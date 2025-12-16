import { ToolCatalog, getTools } from "@/modules/tools";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

const ToolsPage = async () => {
    const tools = await getTools();

    return (
        <PageContainer>
            <PageHeader 
                title="Tools & MCP" 
                description="Catalog of tools available for your agents to use." 
            />
            <PageContent>
                <ToolCatalog tools={tools} />
            </PageContent>
        </PageContainer>
    );
};

export default ToolsPage;