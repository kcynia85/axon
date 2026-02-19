"use client";

import * as React from "react";
import { useChunkingStrategies } from "../application/use-settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";
import { Button } from "@/shared/ui/ui/button";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import {
    Database,
    Layers,
    Scissors,
    Settings2,
    Route,
    Zap,
    Settings,
    Play,
    ShieldCheck,
    BarChart2
} from "lucide-react";

export const ChunkingStrategiesList = () => {
    const { data: strategies, isLoading } = useChunkingStrategies();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {strategies?.map((strategy) => (
                <Card key={strategy.id} className="group hover:border-primary/50 transition-all flex flex-col bg-muted/5">
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
