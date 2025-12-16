import { ScenarioList } from "@/modules/common-uses/features/catalog/ui/scenario-list";
import { getScenarios } from "@/modules/common-uses/features/catalog/infrastructure/api";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

const CommonUsesPage = async () => {
    const scenarios = await getScenarios();

    return (
        <PageContainer>
            <PageHeader 
                title="Common Uses" 
                description="Standardized workflows and templates for common tasks." 
            />
            <PageContent>
                <ScenarioList items={scenarios} />
            </PageContent>
        </PageContainer>
    );
};

export default CommonUsesPage;