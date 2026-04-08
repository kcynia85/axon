"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { VectorStudio } from "@/modules/studio/features/vector-studio/ui/VectorStudio";
import { useCreateVectorDatabase } from "@/modules/settings/application/useSettings";
import { toast } from "sonner";

export default function NewVectorDatabasePage() {
    const router = useRouter();
    const { mutateAsync: createDb, isPending } = useCreateVectorDatabase();

    const handleSave = async (data: any) => {
        try {
            await createDb(data);
            toast.success("Baza wektorowa została utworzona.");
            router.push("/settings/knowledge-engine/vectors");
        } catch (error: any) {
            toast.error(`Błąd zapisu: ${error.message || "Wystąpił nieoczekiwany błąd"}`);
        }
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/vectors");
    };

    return (
        <VectorStudio 
            onSave={handleSave}
            onExit={handleExit}
            isSaving={isPending}
        />
    );
}
