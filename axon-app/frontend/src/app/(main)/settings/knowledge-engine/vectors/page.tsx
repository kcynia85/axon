"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { VectorDatabasesList } from "@/modules/settings/ui/VectorDatabasesList";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { useRouter } from "next/navigation";

const VectorDBPage = () => {
    const router = useRouter();

    return (
        <PageLayout
            title="Vector Databases"
            description="Configure vector storage backends for semantic search."
            breadcrumbs={[]}
            actions={
                <ActionButton 
                    label="Add Database" 
                    onClick={() => router.push("/settings/knowledge-engine/vectors/new")} 
                />
            }
        >
            <VectorDatabasesList />
        </PageLayout>
    );
};

export default VectorDBPage;
