"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { motion } from "framer-motion";

const resourcesNavItems = [
    { title: "Knowledge", href: "/resources/knowledge" },
    { title: "Archetypes", href: "/resources/archetypes" },
    { title: "Tools", href: "/resources/tools" },
];

export const ResourcesNavIsland = () => {
    const pathname = usePathname();
    const router = useRouter();

    const activeTab = resourcesNavItems.find(item => pathname.startsWith(item.href))?.href ?? resourcesNavItems[0].href;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <Tabs value={activeTab} className="w-auto">
                <TabsList className="h-14 p-1.5 bg-gradient-to-br from-zinc-950/60 to-zinc-950/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-none relative">
                    {resourcesNavItems.map((item) => {
                        const isActive = activeTab === item.href;
                        
                        return (
                            <TabsTrigger
                                key={item.href}
                                value={item.href}
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    "rounded-xl gap-2.5 px-6 py-2.5 text-sm transition-all duration-300 relative z-10 h-full cursor-pointer",
                                    isActive 
                                        ? "text-zinc-900 dark:text-zinc-100" 
                                        : "text-zinc-400 hover:text-zinc-100"
                                )}
                            >
                                    {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute inset-0 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-xl shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-800/50"
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                                <span className={cn(
                                    "relative z-10 flex items-center font-bold transition-colors duration-200 text-sm",
                                    isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 hover:text-white"
                                )}>
                                    {item.title}
                                </span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>
        </div>
    );
};
