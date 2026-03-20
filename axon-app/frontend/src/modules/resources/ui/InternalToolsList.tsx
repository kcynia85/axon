"use client";

import * as React from "react";
import { InternalTool } from "@/shared/domain/resources";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";

type InternalToolsListProps = {
    readonly tools: InternalTool[];
    readonly isLoading: boolean;
};

export const InternalToolsList = ({ tools, isLoading }: InternalToolsListProps) => {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((index) => <Skeleton key={index} className="h-40 w-full" />)}
            </div>
        );
    }

    if (tools.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                <p>No internal tools found.</p>
                <p className="text-sm opacity-60">Add a Python file to <code>backend/app/tools/</code> and sync.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-2 h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                {tools.map((tool: InternalTool) => (
                    <Card key={tool.id} className="group hover:border-primary/50 transition-all border-l-4" style={{ borderLeftColor: "#3b82f6" }}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className="text-[8px] h-4 leading-none uppercase font-mono">
                                    PYTHON
                                </Badge>
                                <div className="text-[8px] text-muted-foreground font-mono truncate max-w-[120px]" title={tool.file_path}>
                                    {tool.file_path || "N/A"}
                                </div>
                            </div>
                            <CardTitle className="text-sm font-bold mt-3 font-display truncate" title={tool.tool_function_name}>{tool.tool_name || tool.tool_function_name}</CardTitle>
                            <CardDescription className="text-[10px] mt-1 line-clamp-2 min-h-[32px]">
                                {tool.tool_description || "No description provided."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4 pt-0">
                            <div className="mb-3 text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 p-2 rounded-md truncate">
                                {tool.tool_function_name}(...)
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono opacity-60">Status: Active</span>
                                <Badge variant="outline" className="text-[8px] h-3.5 uppercase bg-green-500/10 text-green-600 border-green-500/20">
                                    Ready
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
