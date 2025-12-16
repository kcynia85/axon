import { AssetList } from "@/modules/knowledge";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { SectionHeader } from "@/shared/ui/section-header";

const BrainPage = () => {
    return (
        <PageContainer>
            <PageHeader 
                title="Brain" 
                description="Knowledge Graph & Asset Browser" 
            />
            <PageContent>
                <SectionHeader title="Assets Library" className="mb-4" />
                <AssetList />
            </PageContent>
        </PageContainer>
    );
};

export default BrainPage;