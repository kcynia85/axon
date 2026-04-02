"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { EmbeddingModelsList } from "@/modules/settings/ui/EmbeddingModelsList";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { useRouter } from "next/navigation";

const EmbeddingPage = () => {
    const router = useRouter();

    return (
        <PageLayout
            title="Embedding Models"
            description="Configure vector embedding providers for knowledge indexing."
            breadcrumbs={[
                { label: "Home", href: "/home" },
                { label: "Settings", href: "/settings" },
                { label: "Knowledge Engine", href: "/settings/knowledge-engine/embedding" },
                { label: "Embedding" }
            ]}
            actions={
                <ActionButton 
                    label="Add Model" 
                    onClick={() => router.push("/settings/knowledge-engine/embedding/new")} 
                />
            }
        >
            <EmbeddingModelsList />
        </PageLayout>
    );
};

export default EmbeddingPage;
