"use client";

import * as React from "react";
import { usePromptArchetypes } from "../application/use-prompt-archetypes";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Sparkles, Edit2, Copy, Trash2, Globe } from "lucide-react";
import { Button } from "@/shared/ui/ui/button";

export const PromptArchetypesList = () => {
    const { data: archetypes, isLoading } = usePromptArchetypes();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
        );
    }

    if (!archetypes || archetypes.length === 0) {
        return (
            <Card className="border-dashed h-40 flex flex-col items-center justify-center text-muted-foreground">
                <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm italic">No prompt archetypes discovered yet.</p>
                <Button variant="link" className="text-xs">Create your first archetype</Button>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {archetypes.map((archetype) => (
                <Card key={archetype.id} className="group hover:border-primary/50 transition-all overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest bg-primary/5">
                                {archetype.workspace_domain}
                            </Badge>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Edit2 className="w-3 h-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="w-3 h-3" /></Button>
                            </div>
                        </div>
                        <CardTitle className="text-sm font-bold mt-2">{archetype.archetype_name}</CardTitle>
                        <CardDescription className="text-[11px] line-clamp-2 leading-relaxed">
                            {archetype.archetype_description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mt-4">
                            <div className="flex -space-x-1.5 overflow-hidden">
                                {archetype.archetype_keywords?.slice(0, 3).map((kw, i) => (
                                    <div key={i} className="px-1.5 py-0.5 rounded-sm bg-muted text-[8px] font-mono border border-background">
                                        {kw}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <div className="h-1 w-full bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
            ))}
        </div>
    );
};
