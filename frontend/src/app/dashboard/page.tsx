import React, { Suspense } from "react";
import { getProjects, ProjectList } from "@/modules/projects";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardPage() {
    const projects = await getProjects();

    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your AI-powered projects.
                </p>
            </header>

            <main>
                <Suspense fallback={<DashboardSkeleton />}>
                    <ProjectList projects={projects} />
                </Suspense>
            </main>
        </div>
    );
}

const DashboardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
        ))}
    </div>
);
