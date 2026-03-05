"use client";

import React from "react";
import Link from "next/link";
import { 
    Rocket, 
    Sparkles, 
    ArrowRight, 
    FolderOpen, 
    Box,
    Clock,
    Plus,
} from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { CreateProjectDialog } from "@/modules/projects/features/browse-projects/ui/CreateProjectDialog";
import { ResourceQuickCard } from "@/shared/ui/complex/ResourceQuickCard";
import { ResourceQuickGrid } from "@/shared/ui/complex/ResourceQuickGrid";

import { UIState } from "@/modules/agents/infrastructure/AiProvider";

type DashboardViewProps = {
    readonly messages: UIState;
    readonly inputValue: string;
    readonly onInputChange: (value: string) => void;
    readonly onSubmission: (event?: React.FormEvent) => void;
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}

const recentlyUsed = [
    { title: "Market Landscape", type: "Space", time: "2 hours ago", icon: FolderOpen, href: "/spaces/1" },
    { title: "Axon MVP", type: "Project", time: "3 hours ago", icon: Box, href: "/projects/p1" },
    { title: "Market Research", type: "Space", time: "Yesterday", icon: FolderOpen, href: "/spaces/2" },
    { title: "Product Strategy", type: "Project", time: "Yesterday", icon: Box, href: "/projects/p2" },
];

export const DashboardView = ({
    inputValue,
    onInputChange,
    onSubmission,
    onKeyDown,
}: DashboardViewProps): React.ReactNode => {
    return (
        <PageContent>
            <div className="flex flex-col space-y-16 py-12 max-w-5xl mx-auto w-full">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                        <Rocket className="w-8 h-8 text-zinc-900 dark:text-white" />
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Cześć, Kamil
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground font-medium">
                        Jedno kliknięcie do „flow state”
                    </p>
                </div>

                {/* --- AI INPUT AREA --- */}
                <div className="w-full space-y-6">
                    <div className="relative flex items-center bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none focus-within:ring-2 focus-within:ring-zinc-900/5 dark:focus-within:ring-white/5 transition-all duration-300 group">
                        <div className="pl-5 text-zinc-400">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <input
                            value={inputValue}
                            onChange={(event) => onInputChange(event.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="Ask AI anything... What do you want to accomplish today?"
                            className="w-full bg-transparent border-none py-3.5 px-4 text-base font-medium focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        />
                        <div className="pr-2">
                            <Button
                                onClick={() => onSubmission()}
                                disabled={!inputValue.trim()}
                                size="icon"
                                className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-all active:scale-95 disabled:opacity-30 shadow-md"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* --- QUICK ACTIONS --- */}
                    <div className="flex flex-wrap gap-2">
                        <CreateProjectDialog trigger={
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="px-4 text-[14px] text-zinc-900/40 dark:text-zinc-100/40 font-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all rounded-xl gap-2 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 h-10 group"
                            >
                                <Plus className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                New Project
                            </Button>
                        } />
                        <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                            className="px-4 text-[14px] text-zinc-900/40 dark:text-zinc-100/40 font-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all rounded-xl gap-2 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 h-10 group"
                        >
                            <Link href="/spaces/new">
                                <Plus className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                New Space
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* --- RECENTLY USED --- */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                        <Clock className="w-3.5 h-3.5" />
                        Recently Used
                    </div>

                    <ResourceQuickGrid>
                        {recentlyUsed.map((item) => (
                            <ResourceQuickCard 
                                key={item.title}
                                title={item.title}
                                badge={item.type}
                                status={item.time}
                                icon={item.icon}
                                href={item.href}
                            />
                        ))}
                    </ResourceQuickGrid>
                </div>
            </div>
        </PageContent>
    );
};
