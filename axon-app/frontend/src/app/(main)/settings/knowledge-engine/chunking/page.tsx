"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { ChunkingStrategiesList } from "@/modules/settings/ui/ChunkingStrategiesList";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { useRouter } from "next/navigation";

const ChunkingPage = () => {
    const router = useRouter();

    return (
        <PageLayout
            title="Chunking Strategies"
            description="Define text segmentation strategies for optimal knowledge retrieval."
            breadcrumbs={[]}
            actions={
                <ActionButton 
                    label="New Strategy" 
                    onClick={() => router.push("/settings/knowledge-engine/chunking/new")} 
                />
            }
        >
            <ChunkingStrategiesList />
        </PageLayout>
    );
};

export default ChunkingPage;
