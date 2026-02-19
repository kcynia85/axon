"use client";

import * as React from "react";
import { useInternalTools } from "@/modules/resources/application/use-internal-tools";
import { InternalTool } from "@/shared/domain/resources";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { RefreshCw, Layers } from "lucide-react";
import { Button } from "@/shared/ui/ui/button";

export const InternalToolsList = () => {
    const { data: tools, isLoading } = useInternalTools();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Native Capabilities
                </h2>
                <Button variant="outline" size="sm" className="h-8 gap-2 text-[10px] font-bold">
                    <RefreshCw className="w-3 h-3" /> Sync MCP Handlers
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools?.map((tool: InternalTool) => (
                    <Card key={tool.id} className="group hover:border-primary/50 transition-all border-l-4" style={{ borderLeftColor: getCategoryColor(tool.tool_category) }}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className="text-[8px] h-4 leading-none uppercase font-mono">
                                    {tool.tool_category}
                                </Badge>
                                <div className="text-[8px] text-muted-foreground font-mono">
                                    NATIVE
                                </div>
                            </div>
                            <CardTitle className="text-sm font-bold mt-3 font-display">{tool.tool_display_name}</CardTitle>
                            <CardDescription className="text-[10px] mt-1 line-clamp-2 min-h-[32px]">
                                {tool.tool_description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4 pt-0">
                            <div className="flex flex-wrap gap-1 mb-3">
                                {tool.tool_keywords.slice(0, 3).map(kw => (
                                    <Badge key={kw} variant="secondary" className="text-[8px] h-3.5 px-1 py-0">{kw}</Badge>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono opacity-60">Status: Active</span>
                                <Badge variant={tool.tool_is_active ? "default" : "outline"} className="text-[8px] h-3.5 uppercase">
                                    {tool.tool_is_active ? "Ready" : "Disabled"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const getCategoryColor = (cat: string) => {
    switch (cat) {
        case "Primeval": return "#f97316";
        case "AI_Utils": return "#3b82f6";
        case "Systems": return "#a855f7";
        case "Local": return "#22c55e";
        default: return "#64748b";
    }
};
