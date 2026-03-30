"use client";

import React, { Suspense, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { RouterStudioContainer } from "@/modules/studio/features/router-studio/ui/RouterStudioContainer";
import { useLLMRouter } from "@/modules/settings/application/useSettings";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import type { RouterFormData } from "@/modules/studio/features/router-studio/types/router-schema";

function RouterStudioEditPageContent() {
    const params = useParams();
    const routerId = params.id as string;
    const { data: router, isLoading, isError } = useLLMRouter(routerId);
    const nextRouter = useRouter();

    const initialData = useMemo((): Partial<RouterFormData> | undefined => {
        if (!router) return undefined;

        return {
            name: router.router_alias,
            strategy: router.router_strategy as any,
            priority_chain: (router.priority_chain as any[]).map(item => ({
                model_id: item.model_id,
                override_params: item.override_params || false,
                error_timeout: item.error_timeout || 30,
            })),
        };
    }, [router]);

    if (isLoading) {
        return (
            <div className="p-12 space-y-12 bg-black min-h-screen">
                <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
                <Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
            </div>
        );
    }

    if (isError || !router) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white space-y-4">
                <h1 className="text-2xl font-bold">Router not found</h1>
                <button 
                    onClick={() => nextRouter.push("/settings/llms/routers")}
                    className="text-zinc-400 hover:text-white underline font-mono"
                >
                    Back to routers
                </button>
            </div>
        );
    }

    return (
        <RouterStudioContainer routerId={routerId} initialData={initialData} />
    );
};

export default function RouterStudioEditPage() {
    return (
        <Suspense fallback={
            <div className="p-12 space-y-12 bg-black min-h-screen">
                <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
                <Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
            </div>
        }>
            <RouterStudioEditPageContent />
        </Suspense>
    );
}
