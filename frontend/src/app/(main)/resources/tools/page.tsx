import { InternalToolsList } from "@/modules/resources/ui/InternalToolsList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";

const ToolsPage = () => {
    return (
        <PageContainer>
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black tracking-tight text-muted-foreground">Internal Tools</h3>
            </div>
            <PageContent>
                <InternalToolsList />
            </PageContent>
        </PageContainer>
    );
};

export default ToolsPage;
