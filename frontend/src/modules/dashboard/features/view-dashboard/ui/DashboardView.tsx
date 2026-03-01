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
import { useUiStore } from "@/shared/lib/store/useUiStore";

interface DashboardViewProps {
    messages: UIState;
    inputValue: string;
    onInputChange: (value: string) => void;
    onSubmission: (event?: React.FormEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
}

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
    const { toggleInbox } = useUiStore();

    const quickActions = [
        { label: "Create project", icon: FolderOpen, href: "/projects?modal=new" },
        { label: "Quick prompt", icon: Sparkles, href: "/workspaces" },
        { label: "View inbox", icon: Zap, onClick: toggleInbox },
    ];

    return (
        <PageContent className="space-y-8 py-8">
            {/* AI Input Hero */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">What do you want to create?</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Ask Axon to help with projects, analysis, or creative tasks.</p>
            </div>

            {/* AI Input */}
            <Card className="border-2 border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
                <CardContent className="p-4">
                    <form onSubmit={onSubmission} className="relative">
                        <Textarea
                            value={inputValue}
                            onChange={(event) => onInputChange(event.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="Ask anything... e.g., 'Analyze Q4 metrics' or 'Draft project proposal'"
                            className="min-h-[120px] resize-none pr-16 text-base border-none focus-visible:ring-0 shadow-none bg-transparent"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim()}
                            className="absolute right-3 bottom-3 h-12 w-12 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-lg"
                        >
                            <SendIcon className="h-5 w-5" />
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Messages Area */}
            {messages.length > 0 && (
                <ScrollArea className="h-[300px] rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white/30 dark:bg-zinc-950/30">
                    {messages.map((message) => (
                        <div key={message.id}>{message.display}</div>
                    ))}
                </ScrollArea>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                    const content = (
                        <Card className="hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <action.icon className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                                </div>
                                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{action.label}</span>
                            </CardContent>
                        </Card>
                    );

                    if (action.href) {
                        return (
                            <Link key={action.label} href={action.href}>
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <div key={action.label} onClick={action.onClick}>
                            {content}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recently Used Spaces */}
                <Card className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 font-bold uppercase tracking-widest text-zinc-500">
                            <Clock className="w-4 h-4" /> Recent Spaces
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {recentSpaces.map((space) => (
                            <Link key={space.name} href={space.href}>
                                <div className="flex items-center justify-between p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all group">
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{space.name}</p>
                                        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-tighter">{space.workspace}</p>
                                    </div>
                                    <Zap className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* Continue Last Project */}
                <Card className="bg-zinc-900 dark:bg-white text-white dark:text-black overflow-hidden relative border-none">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FolderOpen size={120} />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Continue Last Project</CardTitle>
                        <CardDescription className="text-xl font-bold text-white dark:text-black mt-2">Marketing Campaign Q1</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span>3 active agents</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span>2 pending artifacts</span>
                                </div>
                            </div>
                            <Button className="w-full mt-4 bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 font-black uppercase tracking-widest text-[10px] h-11" size="sm">
                                Open Project
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContent>
    );
};
