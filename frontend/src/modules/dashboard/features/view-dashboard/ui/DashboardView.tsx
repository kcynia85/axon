"use client";

import React from "react";
import { 
    Rocket, 
    Sparkles, 
    ArrowRight, 
    Play, 
    FolderOpen, 
    Plus, 
    ChevronRight,
    History,
    Box,
    LayoutGrid,
    Briefcase,
    Search,
    Palette,
    Zap,
    Target,
    Clock
} from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Card, CardContent } from "@/shared/ui/ui/Card";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

import { UIState } from "@/modules/agents/infrastructure/AiProvider";

type DashboardViewProps = {
    readonly messages: UIState;
    readonly inputValue: string;
    readonly onInputChange: (value: string) => void;
    readonly onSubmission: (event?: React.FormEvent) => void;
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}

const quickActions = [
    { label: "Continue last Space", icon: Play, href: "/spaces/last" },
    { label: "Resume last Project", icon: FolderOpen, href: "/projects/last" },
    { label: "Start new Space", icon: Plus, href: "/spaces?modal=new" },
];

const workspaces = [
    {
        title: "Product Management",
        icon: Briefcase,
        color: "bg-blue-500",
        activeProject: "Axon MVP",
        activeSpace: "Product Strategy",
        pendingAiTask: "Roadmap analysis"
    },
    {
        title: "Discovery",
        icon: Search,
        color: "bg-orange-500",
        activeProject: "Axon MVP",
        activeSpace: "Market Map",
        pendingAiTask: "Competitor research"
    },
    {
        title: "Design",
        icon: Palette,
        color: "bg-purple-500",
        activeSpace: "Design System"
    },
    {
        title: "Delivery",
        icon: Zap,
        color: "bg-emerald-500",
        activeProject: "Sprint 12"
    },
    {
        title: "Growth & Market",
        icon: Target,
        color: "bg-pink-500",
        activeSpace: "Market Research",
        pendingAiTask: "GTM strategy draft"
    }
];

const recentlyUsed = [
    { title: "Market Landscape", type: "Space", time: "2 hours ago", icon: FolderOpen },
    { title: "Axon MVP", type: "Project", time: "3 hours ago", icon: Box },
    { title: "Market Research", type: "Space", time: "Yesterday", icon: FolderOpen },
    { title: "Product Strategy", type: "Project", time: "Yesterday", icon: Box },
];

export const DashboardView = ({
    messages,
    inputValue,
    onInputChange,
    onSubmission,
    onKeyDown,
}: DashboardViewProps) => {
    return (
        <PageContent>
            <div className="flex flex-col space-y-12 py-10 max-w-7xl mx-auto w-full px-6 lg:px-10">
                
                {/* --- HEADER --- */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Rocket className="w-8 h-8 text-zinc-900 dark:text-white" />
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                            Cześć, Kamil
                        </h1>
                    </div>
                    <p className="text-lg text-zinc-500 font-medium">
                        Jedno kliknięcie do „flow state”
                    </p>
                </div>

                {/* --- AI INPUT AREA --- */}
                <div className="w-full max-w-5xl">
                    <div className="relative flex items-center bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-none focus-within:ring-2 focus-within:ring-zinc-900/5 dark:focus-within:ring-white/5 transition-all duration-300 group">
                        <div className="pl-6 text-zinc-400">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <input
                            value={inputValue}
                            onChange={(event) => onInputChange(event.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="Ask AI anything... What do you want to accomplish today?"
                            className="w-full bg-transparent border-none py-6 px-4 text-lg font-medium focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        />
                        <div className="pr-4">
                            <Button
                                onClick={() => onSubmission()}
                                disabled={!inputValue.trim()}
                                size="icon"
                                className="h-12 w-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-30 shadow-sm"
                            >
                                <ArrowRight className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* --- QUICK ACTIONS --- */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 px-1">
                        What do you want to work on?
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {quickActions.map((action) => (
                            <Button 
                                key={action.label}
                                variant="outline" 
                                className="h-16 px-8 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all gap-4 text-base font-bold tracking-tight shadow-sm hover:shadow-md border-b-2 active:translate-y-px active:border-b-0"
                            >
                                <action.icon className="w-5 h-5 text-zinc-400" />
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* --- MAIN GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
                    
                    {/* LEFT COLUMN: WORKSPACES */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Workspaces</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {workspaces.map((ws) => (
                                <Card key={ws.title} className="border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-black rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110", ws.color)}>
                                                <ws.icon className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                                                {ws.title}
                                            </h3>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            {ws.activeProject && (
                                                <div className="flex items-start gap-3">
                                                    <Box className="w-4 h-4 text-zinc-300 mt-0.5" />
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Project</p>
                                                        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{ws.activeProject}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {ws.activeSpace && (
                                                <div className="flex items-start gap-3">
                                                    <FolderOpen className="w-4 h-4 text-zinc-300 mt-0.5" />
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Space</p>
                                                        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{ws.activeSpace}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {ws.pendingAiTask && (
                                                <div className="flex items-start gap-3">
                                                    <Sparkles className="w-4 h-4 text-blue-400 mt-0.5" />
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Pending AI Task</p>
                                                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline underline-offset-4 decoration-2">
                                                            {ws.pendingAiTask}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RECENTLY USED */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
                            <Clock className="w-4 h-4" />
                            Recently Used
                        </div>

                        <div className="space-y-3">
                            {recentlyUsed.map((item) => (
                                <Card key={item.title} className="border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-black rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all cursor-pointer shadow-sm group">
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{item.type}</span>
                                                </div>
                                                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">{item.title}</p>
                                                <p className="text-[10px] font-medium text-zinc-400 mt-0.5">{item.time}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-zinc-200 group-hover:text-zinc-400 transition-all" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </PageContent>
    );
};
