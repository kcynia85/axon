import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { ProjectListSkeleton } from "./ProjectListSkeleton";

export const ProjectsSkeleton = () => {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-96" />
            </div>
            <ProjectListSkeleton />
        </div>
    );
};