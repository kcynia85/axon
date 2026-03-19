import { InternalToolsList } from "@/modules/resources/ui/InternalToolsList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";

const ToolsPage = () => {
    return (
        <PageContainer>
            <PageContent>
                <InternalToolsList />
            </PageContent>
        </PageContainer>
    );
};

export default ToolsPage;
