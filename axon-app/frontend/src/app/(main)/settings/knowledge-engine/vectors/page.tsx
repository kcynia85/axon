import { VectorDatabasesList } from "@/modules/settings/ui/VectorDatabasesList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";

const VectorDBPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Vector Databases"
                description="Configure vector storage backends for semantic search."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Database
                </Button>
            </PageHeader>
            <PageContent>
                <VectorDatabasesList />
            </PageContent>
        </PageContainer>
    );
};

export default VectorDBPage;
