"use client";

import React, { useState } from "react";
import { 
    Sparkles, 
    Box,
    Plus,
    Brain,
    ChevronRight,
    ArrowUp,
    Eye,
    EyeOff,
    BookOpen,
    FolderOpen,
    Clock,
    LayoutGrid,
    History as HistoryIcon
} from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { cn } from "@/shared/lib/utils";

import { UIState } from "@/modules/agents/infrastructure/AiProvider";

type DashboardPrototypeViewProps = {
    readonly messages: UIState;
    readonly inputValue: string;
    readonly onInputChange: (value: string) => void;
    readonly onSubmission: (event?: React.FormEvent) => void;
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}

export const DashboardPrototypeView = ({
    inputValue,
    onInputChange,
    onSubmission,
    onKeyDown,
}: DashboardPrototypeViewProps) => {
    const [isFocusMode, setIsFocusMode] = useState(false);

    const quickActions = [
        { label: "Add Space", icon: LayoutGrid },
        { label: "Add Project", icon: Box },
        { label: "Add Knowledge", icon: BookOpen, description: "RAG" },
    ];

    const recentProjects = [
        { id: "p1", title: "Axon MVP Redesign", workspace: "Product", time: "2h ago" },
        { id: "p2", title: "API Integration Layer", workspace: "Engineering", time: "5h ago" },
    ];

    const recentSpaces = [
        { id: "s1", title: "Marketing Strategy Q1", workspace: "Growth", time: "Yesterday" },
        { id: "s2", title: "Developer Docs", workspace: "Engineering", time: "3 days ago" },
    ];

    return (
        <PageContent>
            <div className={cn(
                "flex flex-col w-full max-w-6xl mx-auto px-6 lg:px-8 transition-all duration-700 ease-in-out",
                isFocusMode ? "h-[80vh] justify-center" : "py-6 space-y-8"
            )}>
                
                {/* --- COMPACT HEADER --- */}
                {!isFocusMode && (
                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4 animate-in fade-in duration-500">
                        <div className="flex items-center gap-6">
                            <div className="space-y-0.5">
                                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
                                    Kamil
                                </h1>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                    System Active
                                </p>
                            </div>

                            {/* INTELLIGENCE SNIPPET (Context) - Inline and ultra-compact */}
                            <div className="px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10 flex items-center gap-3">
                                <Brain className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                                <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 leading-none">
                                    Agents awaiting input in <span className="text-zinc-900 dark:text-white font-bold">Product Strategy</span>.
                                </p>
                            </div>
                        </div>
                        
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setIsFocusMode(true)}
                            className="h-8 px-3 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all gap-2 group"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Focus</span>
                        </Button>
                    </div>
                )}

                {/* --- COMMAND CENTER (INPUT) --- */}
                <div className={cn(
                    "w-full transition-all duration-700 ease-in-out relative",
                    isFocusMode ? "max-w-2xl mx-auto" : "max-w-full"
                )}>
                    {isFocusMode && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-in fade-in duration-700">
                            <Button 
                                variant="ghost" 
                                onClick={() => setIsFocusMode(false)}
                                className="rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white group gap-2"
                            >
                                <EyeOff className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-widest">Exit</span>
                            </Button>
                        </div>
                    )}

                    <div className="relative group">
                        <div className="relative flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-300 shadow-sm focus-within:ring-2 focus-within:ring-zinc-900/5 dark:focus-within:ring-white/5 focus-within:border-zinc-300 dark:focus-within:border-zinc-700">
                            <div className="pl-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors duration-300">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <input
                                value={inputValue}
                                onChange={(event) => onInputChange(event.target.value)}
                                onKeyDown={onKeyDown}
                                autoFocus={isFocusMode}
                                placeholder="What are we building today?"
                                className="w-full bg-transparent border-none py-5 px-4 text-lg font-medium focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 tracking-tight text-zinc-900 dark:text-zinc-100"
                            />
                            <div className="pr-3 flex items-center gap-2">
                                <Button
                                    onClick={() => onSubmission()}
                                    disabled={!inputValue.trim()}
                                    size="icon"
                                    className="h-10 w-10 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm transition-all active:scale-95 disabled:opacity-20"
                                >
                                    <ArrowUp className="w-5 h-5 stroke-[3px]" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* QUICK ACTIONS - Integrated directly below */}
                    {!isFocusMode && (
                        <div className="flex flex-wrap justify-start gap-2 mt-3 animate-in fade-in duration-700 delay-200">
                            {quickActions.map((action) => (
                                <Button 
                                    key={action.label}
                                    variant="ghost"
                                    size="sm"
                                    className="px-3 text-[12px] text-zinc-900/40 dark:text-zinc-100/40 font-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all rounded-lg gap-2 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 h-8 group shadow-none"
                                >
                                    <action.icon className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- RECENTLY USED LAYER --- */}
                {!isFocusMode && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        
                        {/* RECENT PROJECTS */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1 text-zinc-400 opacity-60">
                                <Clock className="w-3.5 h-3.5" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Recent Projects</h2>
                            </div>
                            <div className="grid gap-2">
                                {recentProjects.map((item) => (
                                    <div key={item.id} className="group flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all cursor-pointer shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                                <Box className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight leading-none">{item.title}</p>
                                                <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest mt-1.5 leading-none">{item.workspace}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-zinc-200 group-hover:text-zinc-400 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RECENT SPACES */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1 text-zinc-400 opacity-60">
                                <HistoryIcon className="w-3.5 h-3.5" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Recent Spaces</h2>
                            </div>
                            <div className="grid gap-2">
                                {recentSpaces.map((item) => (
                                    <div key={item.id} className="group flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all cursor-pointer shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                                <FolderOpen className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight leading-none">{item.title}</p>
                                                <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest mt-1.5 leading-none">{item.workspace}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-zinc-200 group-hover:text-zinc-400 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* --- COMPACT ZEN FOOTER --- */}
                {isFocusMode && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-zinc-400 opacity-50">Deep Work Active</p>
                    </div>
                )}

            </div>
        </PageContent>
    );
};
