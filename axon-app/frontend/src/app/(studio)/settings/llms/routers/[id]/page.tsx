"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { RouterStudioContainer } from "@/modules/studio/features/router-studio/ui/RouterStudioContainer";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

function RouterStudioEditPageContent() {
    const params = useParams();
    const id = params.id as string;

    // In a real app, we would fetch initialData here using the id
    return (
        <RouterStudioContainer routerId={id} />
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
