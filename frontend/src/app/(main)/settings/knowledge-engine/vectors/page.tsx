import { VectorDatabasesList } from "@/modules/settings/ui/vector-databases-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
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
