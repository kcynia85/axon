"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Database, Sparkles, Wrench } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { motion } from "framer-motion";

const resourcesNavItems = [
    { title: "Knowledge", href: "/resources/knowledge", icon: Database },
    { title: "Archetypes", href: "/resources/archetypes", icon: Sparkles },
    { title: "Tools", href: "/resources/tools", icon: Wrench },
];

export const ResourcesNavIsland = () => {
    const pathname = usePathname();
    const router = useRouter();

    const activeTab = resourcesNavItems.find(item => pathname.startsWith(item.href))?.href ?? resourcesNavItems[0].href;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <Tabs value={activeTab} className="w-auto">
                <TabsList className="h-14 p-1.5 bg-gradient-to-t from-zinc-950 to-black backdrop-blur-xl rounded-full border border-white/10 shadow-2xl relative">
                    {resourcesNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.href;
                        
                        return (
                            <TabsTrigger
                                key={item.href}
                                value={item.href}
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    "rounded-full gap-2.5 px-6 py-2.5 text-sm transition-all duration-300 relative z-10 h-full cursor-pointer",
                                    isActive ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-200"
                                )}
                            >
                                    {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-full shadow-sm"
                                        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                                    />
                                )}
                                <span className={cn(
                                    "relative z-10 flex items-center gap-2.5 font-medium transition-colors duration-200 text-sm",
                                    isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-100"
                                )}>
                                    <Icon className="h-4 w-4" />
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
