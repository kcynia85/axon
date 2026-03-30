'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { LLMModelsList } from "@/modules/settings/ui/LLMModelsList";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

/**
 * ModelsPage - Displays the Model Registry for LLM Models.
 * 
 * Standardized using PageLayout for consistency across Settings and Resources.
 */
const ModelsPage = () => {
    const router = useRouter();

    const goToRegisterModel = () => {
        router.push("/settings/llms/models/new");
    };

    return (
        <PageLayout
            title="Modele LLM"
            description="Register and configure available language models from connected providers."
            actions={
                <ActionButton 
                    label="Dodaj Model" 
                    onClick={goToRegisterModel} 
                />
            }
        >
            <LLMModelsList />
        </PageLayout>
    );
};

export default ModelsPage;
