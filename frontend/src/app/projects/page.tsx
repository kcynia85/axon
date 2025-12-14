import { Suspense } from "react";
import { getProjects, ProjectList } from "@/modules/projects";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
        ))}
    </div>
);

const ProjectsPage = async () => {
    const projects = await getProjects();

    return (
        <div className="container mx-auto py-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
                <p className="text-muted-foreground mt-2">
                    Browse and manage all your ongoing initiatives.
                </p>
            </header>

            <main>
                <Suspense fallback={<ProjectsSkeleton />}>
                    <ProjectList projects={projects} />
                </Suspense>
            </main>
        </div>
    );
};

export default ProjectsPage;
