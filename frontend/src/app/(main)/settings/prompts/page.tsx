import { PromptList } from "@/modules/prompts";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";  

const PromptsPage = () => {
    return (
        <PageContainer>
            <PageHeader 
                title="Prompt Library" 
                description="Create, version, and manage system instructions for your agents." 
            />
            <PageContent>
                <PromptList />
            </PageContent>
        </PageContainer>
    );
};

export default PromptsPage;
