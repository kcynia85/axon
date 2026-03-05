"use client";

import React from "react";
import { 
    Rocket, 
    Sparkles, 
    ArrowRight, 
    FolderOpen, 
    ChevronRight,
    Box,
    Clock
} from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { Card, CardContent } from "@/shared/ui/ui/Card";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Badge } from "@/shared/ui/ui/Badge";

import { UIState } from "@/modules/agents/infrastructure/AiProvider";

type DashboardViewProps = {
    readonly messages: UIState;
    readonly inputValue: string;
    readonly onInputChange: (value: string) => void;
    readonly onSubmission: (event?: React.FormEvent) => void;
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}

const recentlyUsed = [
    { title: "Market Landscape", type: "Space", time: "2 hours ago", icon: FolderOpen },
    { title: "Axon MVP", type: "Project", time: "3 hours ago", icon: Box },
    { title: "Market Research", type: "Space", time: "Yesterday", icon: FolderOpen },
    { title: "Product Strategy", type: "Project", time: "Yesterday", icon: Box },
];

export const DashboardView = ({
    inputValue,
    onInputChange,
    onSubmission,
    onKeyDown,
}: DashboardViewProps): React.ReactNode => {
    return (
        <PageContent>
            <div className="flex flex-col space-y-12 py-10 max-w-5xl mx-auto w-full px-6 lg:px-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col space-y-1">
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
                <div className="w-full">
                    <div className="relative flex items-center bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-none focus-within:ring-2 focus-within:ring-zinc-900/5 dark:focus-within:ring-white/5 transition-all duration-300 group">
                        <div className="pl-6 text-zinc-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <input
                            value={inputValue}
                            onChange={(event) => onInputChange(event.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="Ask AI anything... What do you want to accomplish today?"
                            className="w-full bg-transparent border-none py-5 px-4 text-lg font-medium focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        />
                        <div className="pr-3">
                            <Button
                                onClick={() => onSubmission()}
                                disabled={!inputValue.trim()}
                                size="icon"
                                className="h-11 w-11 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-all active:scale-95 disabled:opacity-30 shadow-lg"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* --- RECENTLY USED --- */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                        <Clock className="w-3.5 h-3.5" />
                        Recently Used
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {recentlyUsed.map((item) => (
                            <Card key={item.title} className="border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-black rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all cursor-pointer shadow-sm group">
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <Badge variant="outline" className="text-[12px] px-1.5 h-4 uppercase font-black tracking-widest bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 leading-none">
                                                    {item.type}
                                                </Badge>
                                            </div>
                                            <p className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight truncate">{item.title}</p>
                                            <p className="text-[12px] font-medium text-zinc-400 mt-1">{item.time}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-zinc-200 group-hover:text-zinc-400 transition-all shrink-0" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </PageContent>
    );
};
