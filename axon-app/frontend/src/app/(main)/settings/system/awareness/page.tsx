"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { SystemAwarenessList } from "@/modules/system/ui/SystemAwarenessList";

const SystemAwarenessPage = () => {
    return (
        <PageLayout
            title="System Awareness"
            description="Manage system embeddings and entity awareness. This is the internal RAG#2 database used by the Meta-Agent."
            breadcrumbs={[]}
        >
            <SystemAwarenessList />
        </PageLayout>
    );
};

export default SystemAwarenessPage;
