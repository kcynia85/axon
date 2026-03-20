import { LLMProvidersList } from "@/modules/settings/ui/LLMProvidersList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
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
