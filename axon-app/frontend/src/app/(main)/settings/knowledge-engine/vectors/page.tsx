"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { VectorDatabasesList } from "@/modules/settings/ui/VectorDatabasesList";

const VectorDBPage = () => {
    return (
        <PageLayout
            title="Vector Databases"
            description="Configure vector storage backends for semantic search."
            breadcrumbs={[]}
        >
            <VectorDatabasesList />
        </PageLayout>
    );
};

export default VectorDBPage;
