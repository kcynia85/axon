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
  SidebarHeader,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarFooter,
} from "@/shared/ui/ui/Sidebar";
import { mainNavigation, appsDropdown, bottomNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipProvider } from "@/shared/ui/ui/Tooltip";

import { useUiStore } from "@/shared/lib/store/useUiStore";

export const Sidebar = () => {
  const pathname = usePathname();
  const [appsExpanded, setAppsExpanded] = useState(false);
  const { toggleInbox, isInboxOpen, isSidebarCollapsed: isCollapsed, toggleSidebar } = useUiStore();

  const SidebarItem = ({ item }: { item: typeof mainNavigation[0] }) => {
    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
    const isInbox = item.name === "Inbox";
    
    const content = (
      <Button
        variant={(isActive && !isInbox) ? "secondary" : "ghost"}
        asChild={!isInbox}
        onClick={isInbox ? (e) => {
          e.preventDefault();
          toggleInbox();
        } : undefined}
        className={cn(
          "w-full justify-start gap-3 px-2 transition-all duration-200 relative group/item",
          !(isActive || (isInbox && isInboxOpen)) ? "text-muted-foreground hover:text-foreground" : "text-foreground font-bold",
          isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "px-2"
        )}
      >
        {isInbox ? (
          <div className={cn("flex items-center gap-3 cursor-pointer", !isCollapsed && "w-full")}>
            <div className="relative">
              <item.icon className="h-4 w-4 shrink-0" />
              <span className={cn(
                "absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-blue-500 border border-white dark:border-zinc-950 transition-transform",
                isCollapsed ? "scale-110" : "scale-100"
              )} />
            </div>
            {!isCollapsed && (
              <>
                <span className="truncate text-sm font-medium">{item.name}</span>
                <span className="ml-auto bg-blue-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none">
                  3
                </span>
              </>
            )}
          </div>
        ) : (
          <Link href={item.href}>
            <div className="relative">
              <item.icon className="h-4 w-4 shrink-0" />
            </div>
            {!isCollapsed && (
              <span className="truncate text-sm font-medium">{item.name}</span>
            )}
          </Link>
        )}
      </Button>
    );

    if (isCollapsed) {
      return (
        <Tooltip content={item.name} side="right">
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <TooltipProvider>
      <SidebarContainer className={cn(
        "transition-all duration-300 ease-in-out z-[70]",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <SidebarHeader className={cn(
          "flex items-center justify-between transition-all duration-300 h-16",
          isCollapsed ? "px-0 justify-center" : "pl-4 pr-5"
        )}>
          {!isCollapsed && (
            <SidebarBrand>
              <Link href="/dashboard" className="block transition-all hover:opacity-100 grayscale hover:grayscale-0 opacity-70">
                <Image 
                  src="/logo-symbol-axon.svg" 
                  alt="Axon" 
                  width={32} 
                  height={32} 
                  className="h-8 w-8 dark:invert shrink-0"
                />
              </Link>
            </SidebarBrand>
          )}

          <Tooltip content={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"} side="right" sideOffset={10}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toggleSidebar()}
              className={cn(
                "h-8 w-8 text-muted-foreground group relative overflow-hidden transition-colors hover:text-foreground shrink-0", 
                isCollapsed && "h-12 w-12 rounded-xl"
              )}
            >
              {isCollapsed ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:opacity-0 group-hover:scale-75 grayscale group-hover:grayscale-0">
                    <Image 
                      src="/logo-symbol-axon.svg" 
                      alt="Axon" 
                      width={24} 
                      height={24} 
                      className="h-6 w-6 dark:invert"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                    <PanelLeftOpen size={20} />
                  </div>
                </>
              ) : (
                <PanelLeftClose size={18} />
              )}
            </Button>
          </Tooltip>
        </SidebarHeader>        
        <Separator />

        <SidebarContent>
          {/* Primary Navigation (includes Inbox) */}
          <SidebarGroup className={cn("py-4", isCollapsed && "px-2")}>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarItem key={item.name} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <Separator />

          {/* Apps Dropdown */}
          {!isCollapsed ? (
            <SidebarGroup className="py-2">
              <button
                onClick={() => setAppsExpanded(!appsExpanded)}
                className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                <SidebarMenu className="mt-1 ml-2">
                  {appsDropdown.map((app) => {
                    return (
                      <Button
                        key={app.name}
                        variant="ghost"
                        asChild
                        className="w-full justify-start gap-3 mb-1 px-2"
                      >
                        <a href={app.href} target="_blank" rel="noopener noreferrer">
                          <span className="text-sm font-medium">{app.name}</span>
                          <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                        </a>
                      </Button>
                    );
                  })}
                </SidebarMenu>
              )}
            </SidebarGroup>
          ) : (
            <SidebarGroup className="py-4 px-2 text-center">
                <Tooltip content="External Apps" side="right">
                  <Button variant="ghost" size="icon" className="w-full h-10 text-muted-foreground hover:text-foreground">
                    <AppWindow className="h-4 w-4" />
                  </Button>
                </Tooltip>
            </SidebarGroup>
          )}

          <Separator />

          <div className="flex-1" /> {/* Spacer to push bottom navigation lower */}
        </SidebarContent>

        <SidebarFooter>
          {/* Settings & Docs */}
          <SidebarGroup className={cn("py-2", isCollapsed && "px-2")}>
            <SidebarMenu>
              {bottomNavigation.map((item) => (
                <SidebarItem key={item.name} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <Separator />

          <SidebarGroup className={cn("p-2 transition-all duration-300", isCollapsed ? "p-2" : "p-2")}>
            {isCollapsed ? (
              <Tooltip content="User Settings" side="right">
                <div>
                  <UserNav hideText={isCollapsed} />
                </div>
              </Tooltip>
            ) : (
              <UserNav hideText={isCollapsed} />
            )}
          </SidebarGroup>
          
          <Separator />
        </SidebarFooter>
      </SidebarContainer>
    </TooltipProvider>
  );
};
