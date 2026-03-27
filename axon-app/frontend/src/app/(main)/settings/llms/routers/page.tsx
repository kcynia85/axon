'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { LLMRoutersBrowser } from "@/modules/settings/ui/LLMRoutersBrowser";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

/**
 * RoutersPage - Displays the Intelligent LLM Routers registry.
 * 
 * Re-implemented using PageLayout and LLMRoutersBrowser for 
 * standard Axon UX (search, filters, and polished cards).
 */
const RoutersPage = () => {
    const router = useRouter();

    const goToCreateRouter = () => {
        router.push("/settings/llms/routers/new");
    };

    return (
        <PageLayout
            title="Routery"
            description="Configure fallback chains and load balancing strategies across models."
            actions={
                <ActionButton 
                    label="Dodaj Routera" 
                    onClick={goToCreateRouter} 
                />
            }
        >
            <LLMRoutersBrowser />
        </PageLayout>
    );
};

export default RoutersPage;
