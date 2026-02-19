import { LLMModelsList } from "@/modules/settings/ui/llm-models-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
import { Plus } from "lucide-react";

const ModelsPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Model Registry"
                description="Register and configure available language models from connected providers."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Register Model
                </Button>
            </PageHeader>
            <PageContent>
                <LLMModelsList />
            </PageContent>
        </PageContainer>
    );
};

export default ModelsPage;
