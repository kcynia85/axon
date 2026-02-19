import { LLMRoutersList } from "@/modules/settings/ui/llm-routers-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
import { Plus } from "lucide-react";

const RoutersPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="LLM Routers"
                description="Configure fallback chains and load balancing strategies across models."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Router
                </Button>
            </PageHeader>
            <PageContent>
                <LLMRoutersList />
            </PageContent>
        </PageContainer>
    );
};

export default RoutersPage;
