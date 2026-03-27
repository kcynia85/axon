'use client';

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { EmbeddingModelsList } from "@/modules/settings/ui/EmbeddingModelsList";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

const EmbeddingPage = () => {
    const goToAddModel = () => {
        // Add model implementation
    };

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
                    onClick={goToAddModel} 
                />
            }
        >
            <EmbeddingModelsList />
        </PageLayout>
    );
};

export default EmbeddingPage;
