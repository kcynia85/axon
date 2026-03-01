"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserNav } from "@/shared/ui/layout/UserNav";
import { Button } from "@/shared/ui/ui/Button";
import { Separator } from "@/shared/ui/ui/Separator";
import { 
  AppWindow, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarFooter,
} from "@/shared/ui/ui/Sidebar";
import { mainNavigation, appsDropdown, bottomNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/utils";
import { Tooltip } from "@/shared/ui/ui/Tooltip";

import { useUiStore } from "@/shared/lib/store/useUiStore";
import { useInboxItems } from "@/modules/inbox/application/useInbox";

export const Sidebar = () => {
  const pathname = usePathname();
  const [appsExpanded, setAppsExpanded] = useState(false);
  const { toggleInbox, isInboxOpen, isSidebarCollapsed: isCollapsed, toggleSidebar } = useUiStore();
  const { data: inboxItems } = useInboxItems();

  const unreadCount = inboxItems?.filter(item => item.item_status === "NEW").length || 0;

  const SidebarItem = ({ item }: { item: typeof mainNavigation[0] }) => {
    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
    const isInbox = item.name === "Inbox";
    const isItemSelected = isActive || (isInbox && isInboxOpen);
    const isHome = item.name === "Home";
    
    const content = (
      <div className="relative w-full flex justify-center">
        <Button
          variant={isItemSelected ? "secondary" : "ghost"}
          asChild={!isInbox}
          onClick={isInbox ? (e) => {
            e.preventDefault();
            toggleInbox();
          } : undefined}
          className={cn(
            "w-full justify-start gap-4 transition-all duration-200 relative group/item rounded-xl",
            !isItemSelected ? "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900" : "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 font-bold shadow-sm",
            isCollapsed ? "h-10 w-10 justify-center px-0" : "h-11 px-3",
            !isCollapsed && isHome && "pr-12"
          )}
        >
          {isInbox ? (
            <div className={cn("flex items-center gap-4 cursor-pointer", !isCollapsed && "w-full")}>
              <div className="relative flex items-center justify-center shrink-0">
                <item.icon className={cn("h-[18px] w-[18px] shrink-0 transition-transform", isItemSelected && "scale-110")} />
                {unreadCount > 0 && (
                  <span className={cn(
                    "absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-blue-500 border border-white dark:border-zinc-950 transition-transform",
                    isCollapsed ? "scale-110" : "scale-100"
                  )} />
                )}
              </div>
              {!isCollapsed && (
                <>
                  <span className="truncate text-sm font-semibold tracking-tight">{item.name}</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black leading-none">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            <Link href={item.href} className="flex items-center gap-4 w-full">
              <div className="relative flex items-center justify-center shrink-0">
                <item.icon className={cn("h-[18px] w-[18px] shrink-0 transition-transform", isItemSelected && "scale-110")} />
              </div>
              {!isCollapsed && (
                <span className="truncate text-sm font-semibold tracking-tight">{item.name}</span>
              )}
            </Link>
          )}
        </Button>
        
        {!isCollapsed && isHome && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Tooltip content="Collapse Sidebar" side="right" sideOffset={10}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSidebar();
                }}
                className="h-8 w-8 text-muted-foreground transition-colors hover:text-foreground shrink-0 rounded-lg bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <PanelLeftClose size={18} />
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    );

    if (isCollapsed) {
      return (
        <div className="py-1 flex justify-center w-full">
          <Tooltip content={item.name} side="right">
            {content}
          </Tooltip>
        </div>
      );
    }

    return <div className="py-0.5">{content}</div>;
  };

  return (
    <SidebarContainer className={cn(
      "transition-all duration-300 ease-in-out z-[70]",
      isCollapsed ? "w-16" : "w-60"
    )}>
      <SidebarContent className={cn(
        "text-left custom-scrollbar overflow-x-hidden flex flex-col",
        isCollapsed ? "px-0 pt-4" : "px-4 pt-4"
      )}>
        {isCollapsed && (
          <div className="flex justify-center mb-6">
            <Tooltip content="Expand Sidebar" side="right" sideOffset={10}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleSidebar()}
                className="h-10 w-10 text-muted-foreground transition-colors hover:text-foreground shrink-0 rounded-xl"
              >
                <PanelLeftOpen size={20} />
              </Button>
            </Tooltip>
          </div>
        )}

        <SidebarGroup className="pt-0 pb-2 px-0 w-full">
          <SidebarMenu className="space-y-1 w-full">
            {mainNavigation.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator className={cn("opacity-50 my-4", isCollapsed ? "mx-4" : "mx-0")} />

        {!isCollapsed && (
          <SidebarGroup className="py-2 px-0 text-left w-full">
            <button
              onClick={() => setAppsExpanded(!appsExpanded)}
              className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors outline-none"
            >
              <span className="flex items-center gap-3">
                <AppWindow className="h-4 w-4" />
                Apps
              </span>
              {appsExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            {appsExpanded && (
              <SidebarMenu className="mt-2 ml-2 space-y-1">
                {appsDropdown.map((app) => (
                  <Button
                    key={app.name}
                    variant="ghost"
                    asChild
                    className="w-full justify-start gap-3 px-3 h-9 rounded-lg"
                  >
                    <a href={app.href} target="_blank" rel="noopener noreferrer">
                      <span className="text-sm font-medium">{app.name}</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </a>
                  </Button>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroup>
        )}

        <div className="flex-1" />
      </SidebarContent>

      <SidebarFooter className={cn(
        "pb-6 flex flex-col",
        isCollapsed ? "px-0" : "px-4"
      )}>
        <SidebarGroup className="py-2 px-0 w-full">
          <SidebarMenu className="space-y-1 w-full text-center">
            {bottomNavigation.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator className={cn("my-4 opacity-50", isCollapsed ? "mx-4" : "mx-0")} />

        <div className={cn("flex items-center w-full", isCollapsed ? "justify-center" : "px-2")}>
          <UserNav hideText={isCollapsed} />
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};
