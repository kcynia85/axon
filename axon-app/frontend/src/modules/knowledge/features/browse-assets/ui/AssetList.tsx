"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssets } from "../infrastructure";
import { AssetCard } from "./AssetCard";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

export const AssetList = () => {
    const { data: assets = [], isLoading } = useQuery({
        queryKey: ["assets"],
        queryFn: async () => getAssets(),
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (assets.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No knowledge assets found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
            ))}
        </div>
    );
};