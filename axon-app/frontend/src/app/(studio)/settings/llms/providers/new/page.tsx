"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProviderStudioContainer } from "@/modules/studio/features/provider-studio/ui/ProviderStudioContainer";
import { ProviderType } from "@/modules/studio/features/provider-studio/types/provider-schema";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

/**
 * ProviderStudioPage: Next.js page component that handles the searchParams
 * and renders the Studio container.
 */
function ProviderStudioPageContent() {
    const searchParams = useSearchParams();
    const type = (searchParams.get("type") as ProviderType) || "cloud";

    return (
        <ProviderStudioContainer 
            initialData={{ provider_type: type }} 
        />
    );
};

export default function ProviderStudioPage() {
    return (
        <Suspense fallback={
            <div className="p-12 space-y-12 bg-black min-h-screen">
                <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
                <Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
            </div>
        }>
            <ProviderStudioPageContent />
        </Suspense>
    );
}
