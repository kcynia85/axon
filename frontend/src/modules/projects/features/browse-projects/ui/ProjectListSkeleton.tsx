import { Skeleton } from "@/shared/ui/ui/Skeleton";
import React from "react";

export const ProjectListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton key={item} className="h-[200px] w-full rounded-xl" />
        ))}
    </div>
);
