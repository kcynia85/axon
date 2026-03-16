"use client";

import * as React from "react";
import { useExternalServices } from "../application/useExternalServices";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Globe, ShieldCheck, Activity, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";

/**
 * ExternalServicesList: UI component for displaying available external services.
 * Standard: 0% useEffect, arrow function.
 */
export const ExternalServicesList = () => {
    const { data: services, isLoading } = useExternalServices();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((index) => <Skeleton key={index} className="h-48 w-full" />)}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services?.map((service) => (
                <Card key={service.id} className="group hover:border-primary/50 transition-all flex flex-col">
                    <CardHeader className="pb-3 bg-muted/20">
                        <div className="flex justify-between items-start">
                            <div className="p-2 rounded bg-background border">
                                <Globe className="w-4 h-4 text-primary" />
                            </div>
                            <Badge variant="secondary" className="text-[8px] h-4">
                                {service.service_category}
                            </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold mt-4">{service.service_name}</CardTitle>
                        <CardDescription className="text-[10px] font-mono lowercase truncate mt-1 text-primary/70">
                            {service.service_url}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 space-y-4">
                        <div className="space-y-2">
                            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                <ShieldCheck className="w-2 h-2" /> Capabilities
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {service.capabilities?.map((cap, i) => (
                                    <span key={i} className="px-1.5 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-[8px] font-bold">
                                        {cap.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-muted/50 mt-auto">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-green-500" />
                                <span className="text-[10px] font-bold">Connected</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="w-3 h-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><ExternalLink className="w-3 h-3" /></Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
