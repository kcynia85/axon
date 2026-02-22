"use client";

import { Button } from "@/shared/ui/ui/Button";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { ScrollArea } from "@/shared/ui/ui/ScrollArea";
import { SendIcon, Clock, Zap, FolderOpen, Sparkles } from "lucide-react";
import { PageContent } from "@/shared/ui/layout/PageContent";
import Link from "next/link";
import React from "react";

import { UIState } from "@/modules/agents/infrastructure/AiProvider";

interface DashboardViewProps {
    messages: UIState;
    inputValue: string;
    onInputChange: (value: string) => void;
    onSubmission: (event?: React.FormEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
}

const quickActions = [
    { label: "Create project", icon: FolderOpen, href: "/projects?modal=new" },
    { label: "Quick prompt", icon: Sparkles, href: "/workspaces" },
    { label: "View inbox", icon: Zap, href: "/inbox" },
];

const recentSpaces = [
    { name: "Product Strategy", href: "/spaces/1", workspace: "Growth" },
    { name: "Q4 Planning", href: "/spaces/2", workspace: "Operations" },
    { name: "AI Research", href: "/spaces/3", workspace: "R&D" },
];

export const DashboardView = ({
    messages,
    inputValue,
    onInputChange,
    onSubmission,
    onKeyDown,
}: DashboardViewProps) => {
    return (
        <PageContent className="space-y-8 py-8">
            {/* AI Input Hero */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">What do you want to create?</h1>
                <p className="text-muted-foreground">Ask Axon to help with projects, analysis, or creative tasks.</p>
            </div>

            {/* AI Input */}
            <Card className="border-2 shadow-lg">
                <CardContent className="p-4">
                    <form onSubmit={onSubmission} className="relative">
                        <Textarea
                            value={inputValue}
                            onChange={(event) => onInputChange(event.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="Ask anything... e.g., 'Analyze Q4 metrics' or 'Draft project proposal'"
                            className="min-h-[100px] resize-none pr-14 text-base"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim()}
                            className="absolute right-3 bottom-3 h-10 w-10"
                        >
                            <SendIcon className="h-5 w-5" />
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Messages Area */}
            {messages.length > 0 && (
                <ScrollArea className="h-[300px] rounded-lg border p-4">
                    {messages.map((message) => (
                        <div key={message.id}>{message.display}</div>
                    ))}
                </ScrollArea>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
                {quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                        <Card className="hover:border-primary/50 transition-all cursor-pointer group">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <action.icon className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-medium text-sm">{action.label}</span>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Recently Used Spaces */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Recently Used Spaces
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {recentSpaces.map((space) => (
                            <Link key={space.name} href={space.href}>
                                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                                    <div>
                                        <p className="font-medium text-sm">{space.name}</p>
                                        <p className="text-xs text-muted-foreground">{space.workspace}</p>
                                    </div>
                                    <Zap className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* Continue Last Project */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Continue Last Project</CardTitle>
                        <CardDescription>Marketing Campaign Q1</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>3 active agents</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <span>2 pending artifacts</span>
                            </div>
                            <Button className="w-full mt-4" size="sm">
                                <FolderOpen className="w-4 h-4 mr-2" />
                                Open Project
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContent>
    );
};
