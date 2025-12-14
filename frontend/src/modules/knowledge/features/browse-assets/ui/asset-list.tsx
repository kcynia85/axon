"use client";

import { useEffect, useState } from "react";
import { getAssets } from "../infrastructure";
import { Asset } from "../../../domain";
import { AssetCard } from "./asset-card";
import { Skeleton } from "@/components/ui/skeleton";

export const AssetList = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const data = await getAssets();
                setAssets(data);
            } catch (error) {
                console.error("Failed to fetch assets", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    if (loading) {
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
