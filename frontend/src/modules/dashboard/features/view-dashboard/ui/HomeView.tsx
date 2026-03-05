"use client";

import React from "react";
import Link from "next/link";
import { 
    Plus,
    Clock
} from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { CreateProjectDialog } from "@/modules/projects/features/browse-projects/ui/CreateProjectDialog";
import { QuickAccessCard } from "@/shared/ui/complex/QuickAccessCard";
import { QuickAccessGrid } from "@/shared/ui/complex/QuickAccessGrid";
import { MagicSphere } from "@/shared/ui/complex/MagicSphere";
import { AiAssistantCard } from "@/shared/ui/complex/AiAssistantCard";

import { UIState } from "@/modules/agents/infrastructure/AiProvider";

type HomeViewProps = {
    readonly messages: UIState;
    readonly inputValue: string;
    readonly onInputChange: (value: string) => void;
    readonly onSubmission: (event?: React.FormEvent) => void;
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}

const recentlyUsed = [
    { title: "Market Landscape", type: "Space", time: "2 hours ago", href: "/spaces/1" },
    { title: "Axon MVP", type: "Project", time: "3 hours ago", href: "/projects/p1" },
    { title: "Market Research", type: "Space", time: "Yesterday", href: "/spaces/2" },
    { title: "Product Strategy", type: "Project", time: "Yesterday", href: "/projects/p2" },
];

export const HomeView = ({
    inputValue,
    onInputChange,
    onSubmission,
    onKeyDown,
}: HomeViewProps): React.ReactNode => {
    return (
        <PageContent className="flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center -mt-9 py-12 max-w-6xl mx-auto w-full space-y-3">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col items-center space-y-6">
                    <MagicSphere />
                    
                    <div className="space-y-2 text-center">
                        <p className="text-zinc-500 dark:text-zinc-400 font-bold tracking-tight text-lg">
                            Hello, Kamil
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                            How can I assist <br className="hidden md:block" /> you today?
                        </h1>
                    </div>
                </div>

                {/* --- MAIN CONTENT (INPUT + RECENTLY USED) --- */}
                <div className="w-full max-w-4xl space-y-9 pt-6">
                    <div className="space-y-4">
                        <AiAssistantCard 
                            value={inputValue}
                            onChange={onInputChange}
                            onSubmit={() => onSubmission()}
                            onKeyDown={onKeyDown}
                        />
                        
                        {/* --- QUICK ACTIONS UNDER INPUT --- */}
                        <div className="flex items-center justify-center gap-2 px-1">
                            <CreateProjectDialog trigger={
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="px-4 text-[14px] text-zinc-900/40 dark:text-zinc-100/40 font-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all rounded-xl gap-2 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 h-10 group"
                                >
                                    <Plus className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    New project
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
                                    New space
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* --- RECENTLY USED SECTION --- */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 pb-2 w-full px-1">
                            <Clock className="w-3.5 h-3.5" />
                            Recently Used
                        </div>

                        <QuickAccessGrid>
                            {recentlyUsed.map((item) => (
                                <QuickAccessCard 
                                    key={item.title}
                                    title={item.title}
                                    badge={item.type}
                                    status={item.time}
                                    href={item.href}
                                    hideArrow={true}
                                />
                            ))}
                        </QuickAccessGrid>
                    </div>
                </div>
            </div>
        </PageContent>
    );
};
