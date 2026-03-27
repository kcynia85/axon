'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { LLMProvidersBrowser } from "@/modules/settings/ui/LLMProvidersBrowser";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

/**
 * ProvidersPage - Displays the Model Registry for LLM Providers.
 * 
 * Re-implemented using PageLayout for consistency with Resources/Knowledge.
 * No manual margins required as base layout is now standardized.
 */
const ProvidersPage = () => {
    const router = useRouter();

    const goToRegisterModel = () => {
        router.push("/settings/llms/providers/new");
    };

    return (
        <>
            <PageLayout
                title="Dostawcy LLM"
                description="Zarządzaj połączeniami API oraz konfiguracją modeli językowych od dostawców chmurowych i lokalnych."
                breadcrumbs={[
                    { label: "Home", href: "/home" },
                    { label: "Settings", href: "/settings" },
                    { label: "LLMs", href: "/settings/llms/providers" },
                    { label: "Providers" }
                ]}
                actions={
                    <ActionButton 
                        label="Dodaj Dostawcę" 
                        onClick={goToRegisterModel} 
                    />
                }
            >
                <LLMProvidersBrowser onAddProvider={goToRegisterModel} />
            </PageLayout>
        </>
    );
};

export default ProvidersPage;

