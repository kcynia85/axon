import { VectorDatabasesList } from "@/modules/settings/ui/VectorDatabasesList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";

const VectorDBPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Vector Databases"
                description="Configure vector storage backends for semantic search."
            />
            <PageContent>
                <VectorDatabasesList />
            </PageContent>
        </PageContainer>
    );
};

export default VectorDBPage;
