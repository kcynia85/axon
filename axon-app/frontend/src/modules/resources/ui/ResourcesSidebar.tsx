"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import {
    Database,
    Sparkles,
    Wrench,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";

const resourcesNavItems = [
    {
        title: "Knowledge",
        href: "/resources/knowledge",
        icon: Database,
    },
    {
        title: "Archetypes",
        href: "/resources/archetypes",
        icon: Sparkles,
    },
    {
        title: "Tools",
        href: "/resources/tools",
        icon: Wrench,
    },
];

export const ResourcesSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const activeTab = resourcesNavItems.find(item => pathname.startsWith(item.href))?.href ?? resourcesNavItems[0].href;

    return (
        <aside className="w-64 border-r bg-muted/10 flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-sm">Resources</h2>
            </div>

            <div className="p-4">
                <Tabs value={activeTab} className="w-full">
                    <TabsList className="w-full h-10 p-1 bg-zinc-900/50 rounded-full border border-zinc-800">
                        {resourcesNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <TabsTrigger
                                    key={item.href}
                                    value={item.href}
                                    onClick={() => router.push(item.href)}
                                    className={cn(
                                        "flex-1 rounded-full gap-2 transition-all duration-200",
                                        activeTab === item.href 
                                            ? "bg-white text-zinc-900 shadow-sm" 
                                            : "text-zinc-400 hover:text-zinc-200"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.title}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </div>
        </aside>
    );
};
