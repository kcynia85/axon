import { LLMProvidersList } from "@/modules/settings/ui/llm-providers-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
import { Plus } from "lucide-react";

const ProvidersPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="LLM Providers"
                description="Manage API connections to cloud and local language model providers."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Provider
                </Button>
            </PageHeader>
            <PageContent>
                <LLMProvidersList />
            </PageContent>
        </PageContainer>
    );
};

export default ProvidersPage;
