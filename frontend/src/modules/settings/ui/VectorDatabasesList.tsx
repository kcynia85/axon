"use client";

import * as React from "react";
import { useVectorDatabases } from "../application/useSettings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Database, ShieldCheck, Activity } from "lucide-react";

export const VectorDatabasesList = () => {
    const { data: dbs, isLoading } = useVectorDatabases();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1].map((index) => <Skeleton key={index} className="h-44 w-full" />)}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dbs?.map((db) => (
                <Card key={db.id} className="group hover:border-primary/50 transition-all flex flex-col">
                    <CardHeader className="p-4 bg-muted/20 border-b">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-primary" />
                                <div>
                                    <CardTitle className="text-sm font-bold">{db.vector_database_name}</CardTitle>
                                    <CardDescription className="text-[10px] font-mono opacity-60 lowercase">{db.vector_database_type}</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-[8px] h-4">Production</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Status
                            </span>
                            <span className="text-green-500 font-bold flex items-center gap-1">
                                <Activity className="w-3 h-3" /> Online
                            </span>
                        </div>
                        <div className="pt-2 border-t border-muted/50">
                            <div className="text-[9px] uppercase font-bold text-muted-foreground">Index URL</div>
                            <div className="text-[10px] font-mono truncate opacity-60">{db.vector_database_connection_url || "Internal Cluster"}</div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
