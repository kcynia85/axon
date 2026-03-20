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
                <TabsList className="h-14 p-1.5 bg-gradient-to-br from-zinc-950/40 to-zinc-950/20 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-none relative">
                    {resourcesNavItems.map((item) => {
                        const isActive = activeTab === item.href;
                        
                        return (
                            <TabsTrigger
                                key={item.href}
                                value={item.href}
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    "rounded-lg gap-2.5 px-6 py-2.5 text-sm transition-all duration-300 relative z-10 h-full cursor-pointer",
                                    isActive ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
                                )}
                            >
                                    {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-lg shadow-lg"
                                        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                                    />
                                )}
                                <span className={cn(
                                    "relative z-10 flex items-center font-medium transition-colors duration-200 text-sm",
                                    isActive ? "text-zinc-950" : "text-zinc-300 group-hover:text-white"
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
