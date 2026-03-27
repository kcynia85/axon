'use client';

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { LLMModelsList } from "@/modules/settings/ui/LLMModelsList";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

/**
 * ModelsPage - Displays the Model Registry for LLM Models.
 * 
 * Standardized using PageLayout for consistency across Settings and Resources.
 */
const ModelsPage = () => {
    const goToRegisterModel = () => {
        // Implementation for registering a new model
    };

    return (
        <PageLayout
            title="Modele LLM"
            description="Register and configure available language models from connected providers."
            breadcrumbs={[
                { label: "Home", href: "/home" },
                { label: "Settings", href: "/settings" },
                { label: "LLMs", href: "/settings/llms/providers" },
                { label: "Models" }
            ]}
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
