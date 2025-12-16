import { AssetList } from "@/modules/knowledge";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";  

const KnowledgePage = () => {
    return (
        <PageContainer>
            <PageHeader 
                title="Knowledge Base" 
                description="Browse assets, templates, and procedures indexed by the system." 
            />
            <PageContent>
                <AssetList />
            </PageContent>
        </PageContainer>
    );
};

export default KnowledgePage;
