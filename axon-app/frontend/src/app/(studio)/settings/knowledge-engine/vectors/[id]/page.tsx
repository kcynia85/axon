"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { VectorStudio } from "@/modules/studio/features/vector-studio/ui/VectorStudio";
import { useVectorDatabase, useUpdateVectorDatabase } from "@/modules/settings/application/useSettings";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

export default function EditVectorDatabasePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const { data: db, isLoading } = useVectorDatabase(id);
    const { mutateAsync: updateDb, isPending: isSaving } = useUpdateVectorDatabase();

    const handleSave = async (data: any) => {
        try {
            await updateDb({ id, data });
            router.push("/settings/knowledge-engine/vectors");
        } catch (error) {
            console.error("Failed to save Vector DB:", error);
        }
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/vectors");
    };

    if (isLoading) return <div className="h-screen w-screen bg-black flex items-center justify-center"><Skeleton className="h-full w-full" /></div>;
    // For mocks, we can still show the studio
    const displayDb = db || (id.includes("mock") ? { id, vector_database_name: id.includes("postgres") ? "Postgres (pgvector)" : "ChromaDB" } : null);
    
    if (!displayDb) return <div>Database not found</div>;

    return (
        <VectorStudio 
            initialData={displayDb}
            onSave={handleSave}
            onExit={handleExit}
            isSaving={isSaving}
        />
    );
}
