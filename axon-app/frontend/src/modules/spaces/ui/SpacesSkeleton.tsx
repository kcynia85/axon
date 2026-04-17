import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { SpaceListSkeleton } from "./SpaceListSkeleton";

export const SpacesSkeleton = () => {
    return (
        <div className="space-y-8">
            <div className="mb-8 space-y-4">
                <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <div className="h-14 w-full flex items-center justify-between border-y border-zinc-100 dark:border-zinc-800">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>
            <SpaceListSkeleton />
        </div>
    );
};
