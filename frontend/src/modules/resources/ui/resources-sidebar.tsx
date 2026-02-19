"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import {
    Database,
    Sparkles,
    Wrench,
    Globe,
    Zap,
    ChevronRight,
} from "lucide-react";

const resourcesNavItems = [
    {
        title: "Knowledge Base",
        href: "/resources/knowledge",
        icon: Database,
        description: "Browse hubs and sources",
    },
    {
        title: "Prompt Archetypes",
        href: "/resources/prompts",
        icon: Sparkles,
        description: "Manage system prompts",
    },
    {
        title: "Internal Tools",
        href: "/resources/tools",
        icon: Wrench,
        description: "Native capabilities",
    },
    {
        title: "External Services",
        href: "/resources/services",
        icon: Globe,
        description: "Third-party integrations",
    },
    {
        title: "Automations",
        href: "/resources/automations",
        icon: Zap,
        description: "Webhooks and workflows",
    },
];

export const ResourcesSidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-muted/10 flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-sm">Resources</h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Knowledge, tools & integrations
                </p>
            </div>

            <nav className="flex-1 p-2 space-y-1">
                {resourcesNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-start gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="truncate">{item.title}</span>
                                    {isActive && (
                                        <ChevronRight className="h-3 w-3 shrink-0" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
