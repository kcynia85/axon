import { Skeleton } from "@/shared/ui/ui/skeleton";

export const DashboardListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
        ))}
    </div>
);
