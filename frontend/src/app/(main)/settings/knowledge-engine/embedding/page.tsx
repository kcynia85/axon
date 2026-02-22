import { EmbeddingModelsList } from "@/modules/settings/ui/EmbeddingModelsList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
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
