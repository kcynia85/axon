"use client";

import * as React from "react";
import { useAutomations } from "../application/useAutomations";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Zap, Clock, MoreHorizontal, Play, BarChart3 } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";

export const AutomationsList = () => {
    const { data: automations, isLoading } = useAutomations();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((index) => <Skeleton key={index} className="h-44 w-full" />)}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {automations?.map((auto) => (
                <Card key={auto.id} className="group hover:border-primary/50 transition-all flex flex-col bg-muted/5">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                <CardTitle className="text-sm font-bold truncate pr-6">{auto.automation_name}</CardTitle>
                            </div>
                            <Badge variant={auto.automation_status === "Active" ? "default" : "secondary"} className="text-[8px] h-4">
                                {auto.automation_status || "Idle"}
                            </Badge>
                        </div>
                        <CardDescription className="text-[10px] mt-1 italic">
                            Platform: {auto.automation_platform}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-4">
                        <div className="bg-background border rounded p-3 flex justify-between items-center">
                            <div className="space-y-1">
                                <div className="text-[8px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-2 h-2" /> Recent Trigger
                                </div>
                                <div className="text-[10px] font-mono">2h ago SUCCESS</div>
                            </div>
                            <div className="h-8 w-[1px] bg-muted" />
                            <div className="space-y-1 text-right">
                                <div className="text-[8px] uppercase font-bold text-muted-foreground flex items-center gap-1 justify-end">
                                    <BarChart3 className="w-2 h-2" /> Volume
                                </div>
                                <div className="text-[10px] font-mono">1.2k / day</div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="default" size="sm" className="flex-1 h-7 text-[10px] gap-2">
                                <Play className="w-3 h-3" /> Test Run
                            </Button>
                            <Button variant="outline" size="icon" className="h-7 w-7"><MoreHorizontal className="w-3 h-3" /></Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
