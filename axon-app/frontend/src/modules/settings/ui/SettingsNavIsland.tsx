"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../infrastructure/api";
import { ChevronLeft } from "lucide-react";

const settingsNavGroups = [
    {
        id: "llms",
        title: "LLMs",
        href: "/settings/llms",
        items: [
            { name: "Providers", href: "/settings/llms/providers", queryKey: ["llm-providers"], queryFn: settingsApi.getLLMProviders },
            { name: "Models", href: "/settings/llms/models", queryKey: ["llm-models"], queryFn: settingsApi.getLLMModels },
            { name: "Routers", href: "/settings/llms/routers", queryKey: ["llm-routers"], queryFn: settingsApi.getLLMRouters },
        ],
    },
    {
        id: "knowledge-engine",
        title: "Knowledge Engine",
        href: "/settings/knowledge-engine",
        items: [
            { name: "Embedding", href: "/settings/knowledge-engine/embedding", queryKey: ["embedding-models"], queryFn: settingsApi.getEmbeddingModels },
            { name: "Chunking", href: "/settings/knowledge-engine/chunking", queryKey: ["chunking-strategies"], queryFn: settingsApi.getChunkingStrategies },
            { name: "Vectors", href: "/settings/knowledge-engine/vectors", queryKey: ["vector-databases"], queryFn: settingsApi.getVectorDatabases },
        ],
    },
    {
        id: "system",
        title: "System",
        href: "/settings/system",
        items: [
            { name: "System", href: "/settings/system/awareness", queryKey: ["system-awareness"], queryFn: settingsApi.getSystemEmbeddings },
            { name: "Meta Agent", href: "/settings/system/meta-agent", queryKey: ["system-meta-agent"], queryFn: () => Promise.resolve([]) },
        ],
    },
];

export const SettingsNavIsland = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    
    // Check if we are in "force main view" mode via URL param
    const isForcedMain = searchParams.get("view") === "main";

    // Derived drill-down state - No useMemo, let React Compiler handle it
    const isDrilledDown = !isForcedMain && settingsNavGroups.some(group => 
        group.items.some(item => pathname === item.href)
    );

    const activeGroup = (pathname && settingsNavGroups.find(group => pathname.startsWith(group.href))) ?? settingsNavGroups[0];

    const handlePrefetch = (item: typeof settingsNavGroups[0]["items"][0]) => {
        if (item.queryKey && item.queryFn) {
            queryClient.prefetchQuery({
                queryKey: item.queryKey,
                queryFn: item.queryFn,
                staleTime: 60 * 1000,
            });
        }
    };

    const handleGoBack = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Add ?view=main to stay on current page but show main categories
        router.push(`${pathname}?view=main`);
    };

    const handleGroupClick = (group: typeof settingsNavGroups[0]) => {
        // Navigating to a sub-item naturally clears the ?view=main param
        router.push(group.items[0].href);
    };

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
            <AnimatePresence mode="wait" initial={false}>
                {!isDrilledDown ? (
                    <motion.div
                        key="main-level"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Tabs value={activeGroup.id} className="w-auto">
                            <TabsList className="h-12 bg-zinc-950/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-1.5 gap-1">
                                {settingsNavGroups.map((group) => {
                                    const isActive = activeGroup.id === group.id;
                                    return (
                                        <TabsTrigger
                                            key={`main-${group.id}`}
                                            value={group.id}
                                            onClick={() => handleGroupClick(group)}
                                            className={cn(
                                                "rounded-xl px-5 py-2 text-[14px] font-bold transition-all duration-300 relative z-10 h-full cursor-pointer flex items-center justify-center",
                                                isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="island-pill-main"
                                                    className="absolute inset-0 bg-zinc-900 rounded-xl shadow-sm ring-1 ring-white/10"
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            <span className="relative z-10">{group.title}</span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                    </motion.div>
                ) : (
                    <motion.div
                        key="sub-level"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="h-12 bg-zinc-950/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl flex items-center px-1.5 gap-1 overflow-hidden"
                    >
                        {/* Back Section */}
                        <div className="flex items-center">
                            <button 
                                onClick={handleGoBack}
                                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white flex items-center justify-center h-9 w-9"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="px-3 py-1.5 text-[13px] font-bold text-zinc-400 flex items-center justify-center whitespace-nowrap">
                                {activeGroup.title}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />

                        {/* Sub-items Section */}
                        <Tabs value={pathname} className="w-auto">
                            <TabsList className="bg-transparent border-none p-0 h-auto gap-0.5">
                                {activeGroup.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <TabsTrigger
                                            key={`sub-${item.href}`}
                                            value={item.href}
                                            onClick={() => router.push(item.href)}
                                            onMouseEnter={() => handlePrefetch(item)}
                                            className={cn(
                                                "rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-all duration-300 relative z-10 h-9 cursor-pointer flex items-center justify-center",
                                                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="island-pill-sub"
                                                    className="absolute inset-0 bg-white/10 rounded-lg ring-1 ring-white/10"
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            <span className="relative z-10">{item.name}</span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
