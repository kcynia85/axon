"use client";

import * as React from "react";
import { useEmbeddingModels } from "../application/use-settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Database, Binary, Activity, Key } from "lucide-react";

export const EmbeddingModelsList = () => {
    const { data: models, isLoading } = useEmbeddingModels();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {models?.map((model) => (
                <Card key={model.id} className="group hover:border-primary/50 transition-all border-l-4 border-l-primary/30">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                            <Binary className="w-4 h-4 text-primary" />
                            <Badge variant="outline" className="text-[8px] h-4 font-mono">{model.model_provider_id.slice(0, 8)}</Badge>
                        </div>
                        <CardTitle className="text-sm font-bold mt-3 font-display">{model.model_name}</CardTitle>
                        <CardDescription className="text-[10px] font-mono opacity-60 truncate">
                            {model.model_api_identifier}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="flex justify-between items-baseline border-t border-muted/30 pt-3">
                            <span className="text-[9px] uppercase font-bold text-muted-foreground">Dimensions</span>
                            <span className="text-[10px] font-bold font-mono">1536</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
