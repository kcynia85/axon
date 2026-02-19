import { ChunkingStrategiesList } from "@/modules/settings/ui/chunking-strategies-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
import { Plus } from "lucide-react";

const ChunkingPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Chunking Strategies"
                description="Define text segmentation strategies for optimal knowledge retrieval."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Strategy
                </Button>
            </PageHeader>
            <PageContent>
                <ChunkingStrategiesList />
            </PageContent>
        </PageContainer>
    );
};

export default ChunkingPage;
