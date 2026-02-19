"use client";

import * as React from "react";
import { useLLMProviders } from "../application/use-llm-providers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Cpu, ShieldCheck, Activity, Settings, ExternalLink, Key } from "lucide-react";
import { Button } from "@/shared/ui/ui/button";

export const LLMProvidersList = () => {
    const { data: providers, isLoading } = useLLMProviders();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-44 w-full" />)}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providers?.map((provider) => (
                <Card key={provider.id} className="group hover:border-primary/50 transition-all flex flex-col">
                    <CardHeader className="p-4 bg-muted/20 border-b">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-background border flex items-center justify-center font-bold text-xs">
                                    {provider.provider_name.slice(0, 1).toUpperCase()}
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-bold">{provider.provider_name}</CardTitle>
                                    <CardDescription className="text-[10px] font-mono opacity-60">ID: {provider.id.slice(0, 8)}</CardDescription>
                                </div>
                            </div>
                            <Badge variant={provider.provider_api_key_required ? "default" : "secondary"} className="text-[8px] h-4">
                                {provider.provider_api_key_required ? "Key Required" : "Public"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[8px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                    <Cpu className="w-2 h-2" /> Protocol
                                </span>
                                <span className="text-[10px] font-bold">OpenAI v1</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                    <Key className="w-2 h-2" /> Context Limit
                                </span>
                                <span className="text-[10px] font-bold font-mono">128k</span>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-2">
                                <Settings className="w-3 h-3" /> Config
                            </Button>
                            <Button variant="outline" size="icon" className="h-7 w-7"><ExternalLink className="w-3 h-3" /></Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 text-muted-foreground bg-muted/5">
                <Button variant="ghost" size="sm" className="gap-2 text-xs">
                    <span className="w-4 h-4 rounded-full border flex items-center justify-center">+</span>
                    Connect Provider
                </Button>
                <p className="text-[10px] mt-2 opacity-60">OpenAI, Anthropic, Local, etc.</p>
            </Card>
        </div>
    );
};
