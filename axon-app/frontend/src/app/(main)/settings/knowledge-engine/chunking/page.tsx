"use client";

import { ChunkingStrategiesList } from "@/modules/settings/ui/ChunkingStrategiesList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ChunkingPage = () => {
    const router = useRouter();

    return (
        <PageContainer>
            <PageHeader
                title="Chunking Strategies"
                description="Define text segmentation strategies for optimal knowledge retrieval."
            >
                <Button onClick={() => router.push("/settings/knowledge-engine/chunking/new")}>
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
