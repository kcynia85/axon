"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { motion } from "framer-motion";

const settingsNavGroups = [
    {
        id: "llms",
        title: "LLMs",
        href: "/settings/llms",
        items: [
            { name: "Providers", href: "/settings/llms/providers" },
            { name: "Models", href: "/settings/llms/models" },
            { name: "Routers", href: "/settings/llms/routers" },
        ],
    },
    {
        id: "knowledge-engine",
        title: "Knowledge Engine",
        href: "/settings/knowledge-engine",
        items: [
            { name: "Embedding", href: "/settings/knowledge-engine/embedding" },
            { name: "Chunking", href: "/settings/knowledge-engine/chunking" },
            { name: "Vectors", href: "/settings/knowledge-engine/vectors" },
        ],
    },
];

export const SettingsNavIsland = () => {
    const pathname = usePathname();
    const router = useRouter();

    const activeGroup = settingsNavGroups.find(group => pathname.startsWith(group.href)) ?? settingsNavGroups[0];
    const activeSubTab = activeGroup.items.find(item => pathname === item.href)?.href ?? activeGroup.items[0].href;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
            {/* Level 1: Main Categories */}
            <Tabs value={activeGroup.href} className="w-auto">
                <TabsList className="h-12 p-1.5 bg-zinc-950/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl relative">
                    {settingsNavGroups.map((group) => {
                        const isActive = activeGroup.id === group.id;
                        
                        return (
                            <TabsTrigger
                                key={group.id}
                                value={group.href}
                                onClick={() => router.push(group.href)}
                                className={cn(
                                    "rounded-xl gap-2.5 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative z-10 h-full cursor-pointer",
                                    isActive 
                                        ? "text-zinc-100" 
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                    {isActive && (
                                    <motion.div
                                        layoutId="settings-main-pill"
                                        className="absolute inset-0 bg-zinc-900 rounded-xl shadow-sm ring-1 ring-white/10"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">
                                    {group.title}
                                </span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>

            {/* Level 2: Sub-items */}
            <Tabs value={activeSubTab} className="w-auto">
                <TabsList className="h-10 p-1 bg-zinc-900/40 backdrop-blur-md rounded-xl border border-white/5 shadow-lg relative">
                    {activeGroup.items.map((item) => {
                        const isActive = pathname === item.href;
                        
                        return (
                            <TabsTrigger
                                key={item.href}
                                value={item.href}
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    "rounded-lg px-4 py-1.5 text-[10px] font-bold transition-all duration-300 relative z-10 h-full cursor-pointer",
                                    isActive 
                                        ? "text-white" 
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                    {isActive && (
                                    <motion.div
                                        layoutId="settings-sub-pill"
                                        className="absolute inset-0 bg-white/10 rounded-lg ring-1 ring-white/10"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">
                                    {item.name}
                                </span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>
        </div>
    );
};
