"use client";

import * as React from "react";
import { useChunkingStrategies } from "../application/useSettings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import {
    Scissors
} from "lucide-react";
import { useRouter } from "next/navigation";

export const ChunkingStrategiesList = () => {
    const { data: strategies, isLoading } = useChunkingStrategies();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((index) => (
                    <Card key={index} className="flex flex-col h-40 bg-muted/5">
                        <CardHeader className="p-4 bg-muted/10 border-b">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded" />
                                <Skeleton className="h-4 w-32 rounded" />
                            </div>
                            <Skeleton className="h-2 w-20 mt-2 rounded" />
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-2 w-8" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-2 w-8" />
                                <Skeleton className="h-3 w-10" />
                                <Skeleton className="h-2 w-8" />
                                <Skeleton className="h-3 w-10" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {strategies?.map((strategy) => (
                <Card 
                    key={strategy.id} 
                    className="group hover:border-primary/50 transition-all flex flex-col bg-muted/5 cursor-pointer"
                    onClick={() => router.push(`/settings/knowledge-engine/chunking/${strategy.id}`)}
                >
                    <CardHeader className="p-4 bg-muted/20 border-b">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Scissors className="w-4 h-4 text-primary" />
                                <CardTitle className="text-sm font-bold truncate pr-6">{strategy.strategy_name}</CardTitle>
                            </div>
                        </div>
                        <CardDescription className="text-[10px] mt-1 font-mono uppercase opacity-60">
                            {strategy.strategy_chunking_method.split('_')[0]} Protocol
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-1">
                            <span className="text-[8px] uppercase font-bold text-muted-foreground">Type</span>
                            <span className="text-[10px] font-bold font-mono uppercase tracking-tighter">
                                {strategy.strategy_chunking_method.split('_')[0]}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[8px] uppercase font-bold text-muted-foreground mr-1">Size</span>
                            <Badge variant="outline" className="text-[8px] h-3 px-1 font-mono">{strategy.strategy_chunk_size}</Badge>
                            <span className="text-[8px] uppercase font-bold text-muted-foreground mx-1">Gap</span>
                            <Badge variant="outline" className="text-[8px] h-3 px-1 font-mono">{strategy.strategy_chunk_overlap}</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
