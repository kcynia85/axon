import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { DashboardListSkeleton } from "./DashboardListSkeleton";

export const DashboardSkeleton = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-96" />
            </div>
            <DashboardListSkeleton />
        </div>
    );
};