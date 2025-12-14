"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Library,
  Brain,
  Settings,
  Inbox,
  FileText,
  Workflow,
  Zap
} from "lucide-react";

const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workspace", href: "/workspace", icon: MessageSquare },
  { name: "Projects", href: "/projects", icon: Library },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Brain", href: "/brain", icon: Brain },
  { name: "Workflows", href: "/workflows", icon: Workflow },
  { name: "Common Uses", href: "/common-uses", icon: Zap },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Docs", href: "/docs", icon: FileText },
];

export const Sidebar = () => {
  const pathname = usePathname();

  const NavItem = ({ item }: { item: typeof mainNavigation[0] }) => {
    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-screen w-64 border-r bg-background">
      <div className="p-6 border-b flex justify-center items-center h-[80px]">
        <Image 
          src="/logo.svg" 
          alt="Axon Logo" 
          width={120} 
          height={38} 
          priority
          className="dark:invert"
        />
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {mainNavigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          System
        </p>
        <div className="space-y-1">
          {secondaryNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="text-xs text-muted-foreground text-center">
          v0.1.0 MVP
        </div>
      </div>
    </div>
  );
};