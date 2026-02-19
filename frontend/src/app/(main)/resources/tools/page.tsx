import { InternalToolsList } from "@/modules/resources/ui/internal-tools-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

const ToolsPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Internal Tools"
                description="Browse and manage native agent capabilities and MCP handlers."
            />
            <PageContent>
                <InternalToolsList />
            </PageContent>
        </PageContainer>
    );
};

export default ToolsPage;
