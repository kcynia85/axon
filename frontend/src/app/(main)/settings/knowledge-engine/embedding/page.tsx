import { EmbeddingModelsList } from "@/modules/settings/ui/embedding-models-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
import { Plus } from "lucide-react";

const EmbeddingPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Embedding Models"
                description="Configure vector embedding providers for knowledge indexing."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Model
                </Button>
            </PageHeader>
            <PageContent>
                <EmbeddingModelsList />
            </PageContent>
        </PageContainer>
    );
};

export default EmbeddingPage;
