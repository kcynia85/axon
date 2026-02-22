import { LLMModelsList } from "@/modules/settings/ui/LLMModelsList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
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
