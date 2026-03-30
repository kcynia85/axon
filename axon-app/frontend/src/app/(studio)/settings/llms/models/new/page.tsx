"use client";

import React, { Suspense } from "react";
import { ModelStudioContainer } from "@/modules/studio/features/model-studio/ui/ModelStudioContainer";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

const ModelStudioPageContent = () => {
    return (
        <ModelStudioContainer />
    );
};

export default function ModelStudioPage() {
    return (
        <Suspense fallback={
            <div className="p-12 space-y-12 bg-black min-h-screen">
                <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
                <Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
            </div>
        }>
            <ModelStudioPageContent />
        </Suspense>
    );
}