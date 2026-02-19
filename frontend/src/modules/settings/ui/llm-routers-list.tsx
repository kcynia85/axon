"use client";

import * as React from "react";
import { useLLMRouters } from "../application/use-settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";
import { Route, Zap, Settings, Play, ShieldCheck, BarChart2 } from "lucide-react";
import { Button } from "@/shared/ui/ui/button";
import { Skeleton } from "@/shared/ui/ui/skeleton";

export const LLMRoutersList = () => {
    const { data: routers, isLoading } = useLLMRouters();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
        );
    }

    if (!routers || routers.length === 0) {
        return (
            <Card className="border-dashed h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                <Route className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm italic text-center px-6">No intelligent routers configured. Traffic will hit default models.</p>
                <Button variant="link" className="text-xs mt-2">+ Define Dynamic Router</Button>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {routers.map((router) => (
                <Card key={router.id} className="group hover:border-primary/50 transition-all flex flex-col">
                    <CardHeader className="p-4 bg-muted/10 border-b">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Route className="w-4 h-4 text-primary" />
                                <CardTitle className="text-xs font-bold font-display uppercase tracking-widest leading-none">
                                    {router.router_alias}
                                </CardTitle>
                            </div>
                            <Badge variant="outline" className="text-[8px] h-4 py-0 font-mono tracking-tighter">
                                {router.router_strategy}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                <ShieldCheck className="w-2 h-2" /> Logic Engine
                            </span>
                            <p className="text-[11px] font-mono leading-relaxed bg-muted/30 p-2 rounded border border-primary/5">
                                Optimizing cost vs intelligence for tactical queries.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-muted/50 flex justify-between items-center mt-auto">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-3 h-3 text-primary opacity-60" />
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Hit Rate: 94%</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="w-3.5 h-3.5" /></Button>
                                <Button variant="default" size="sm" className="h-7 text-[10px] gap-2">
                                    <Play className="w-3 h-3" /> Test
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
