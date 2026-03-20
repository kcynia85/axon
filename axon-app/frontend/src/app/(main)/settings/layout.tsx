"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import {
    Cpu,
    Layers,
    Boxes,
    Server,
    ChevronRight,
} from "lucide-react";

const settingsNavGroups = [
    {
        title: "LLMs",
        items: [
            { name: "Providers", href: "/settings/llms/providers", icon: Cpu, description: "API connections" },
            { name: "Model Registry", href: "/settings/llms/models", icon: Layers, description: "Available models" },
            { name: "Routers", href: "/settings/llms/routers", icon: Server, description: "Fallback & load balancing" },
        ],
    },
    {
        title: "Knowledge Engine",
        items: [
            { name: "Embedding Models", href: "/settings/knowledge-engine/embedding", icon: Layers, description: "Vector embeddings" },
            { name: "Chunking Strategies", href: "/settings/knowledge-engine/chunking", icon: Boxes, description: "Text segmentation" },
            { name: "Vector Databases", href: "/settings/knowledge-engine/vectors", icon: Server, description: "Storage backends" },
        ],
    },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/10 flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm">Settings</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Configure AI and integrations
          </p>
        </div>

        <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
          {settingsNavGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname?.startsWith(item.href);
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
                          <span className="truncate">{item.name}</span>
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
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
