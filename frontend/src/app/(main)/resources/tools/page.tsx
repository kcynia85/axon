import { InternalToolsList } from "@/modules/resources/ui/InternalToolsList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";

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
