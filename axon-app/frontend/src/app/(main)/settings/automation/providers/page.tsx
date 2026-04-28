"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { AutomationProvidersBrowser } from "@/modules/settings/ui/AutomationProvidersBrowser";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

export default function AutomationProvidersPage() {
    const router = useRouter();

    const goToAddProvider = () => {
        router.push("/settings/automation/providers/new");
    };

    return (
        <>
            <PageLayout
                title="Dostawcy Automatyzacji"
                description="Zarządzaj autoryzacją i połączeniami dla platform automatyzacji (n8n, Make)."
                actions={
                    <ActionButton 
                        label="Dodaj Dostawcę" 
                        onClick={goToAddProvider} 
                    />
                }
            >
                <AutomationProvidersBrowser />
            </PageLayout>
        </>
    );
}
