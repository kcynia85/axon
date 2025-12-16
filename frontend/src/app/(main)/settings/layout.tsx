"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bot, Wrench, Cpu, Database, Wand2 } from "lucide-react";

const settingsNav = [
  { name: "Knowledge", href: "/settings/knowledge", icon: Database },
  { name: "Prompts", href: "/settings/prompts", icon: Wand2 },
  { name: "Agents", href: "/settings/agents", icon: Bot },
  { name: "Tools", href: "/settings/tools", icon: Wrench },
  { name: "LLMs", href: "/settings/llms", icon: Cpu },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <header className="border-b px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <nav className="flex space-x-4">
          {settingsNav.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
