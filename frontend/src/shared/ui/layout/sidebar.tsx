"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/shared/ui/ui/ModeToggle";
import { UserNav } from "@/shared/ui/layout/UserNav";
import { Button } from "@/shared/ui/ui/Button";
import { Separator } from "@/shared/ui/ui/Separator";
import { AppWindow, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import {
  Sidebar as SidebarContainer,
  SidebarHeader,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarFooter,
  SidebarFooterRow,
  SidebarVersion,
} from "@/shared/ui/ui/Sidebar";
import { mainNavigation, appsDropdown, docsLink, bottomNavigation } from "@/shared/config/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const [appsExpanded, setAppsExpanded] = useState(false);

  const SidebarItem = ({ item }: { item: typeof mainNavigation[0] }) => {
    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
    return (
      <Button
        variant={isActive ? "default" : "ghost"}
        asChild
        className="w-full justify-start gap-3 mb-1 px-2"
      >
        <Link href={item.href}>
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      </Button>
    );
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarBrand>
          <Link href="/dashboard" className="block transition-opacity hover:opacity-80">
            <Image 
              src="/logo-symbol-axon.svg" 
              alt="Axon" 
              width={40} 
              height={40} 
              className="h-10 w-10 dark:invert"
            />
          </Link>
        </SidebarBrand>
      </SidebarHeader>
      
      <Separator />

      <SidebarContent>
        {/* Primary Navigation */}
        <SidebarGroup className="py-4">
          <SidebarMenu>
            {mainNavigation.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator />

        {/* Apps Dropdown & Docs */}
        <SidebarGroup className="py-2">
          <button
            onClick={() => setAppsExpanded(!appsExpanded)}
            className="flex items-center justify-between w-full px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                const AppIcon = app.icon;
                return (
                  <Button
                    key={app.name}
                    variant="ghost"
                    asChild
                    className="w-full justify-start gap-3 mb-1 px-2"
                  >
                    <a href={app.href} target="_blank" rel="noopener noreferrer">
                      <AppIcon className="h-4 w-4" />
                      {app.name}
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </a>
                  </Button>
                );
              })}
            </SidebarMenu>
          )}

          {(() => {
            const DocsIcon = docsLink.icon;
            return (
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start gap-3 mb-1 px-2"
              >
                <a href={docsLink.href} target="_blank" rel="noopener noreferrer">
                  <DocsIcon className="h-4 w-4" />
                  {docsLink.name}
                  <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                </a>
              </Button>
            );
          })()}
        </SidebarGroup>

        <Separator />

        {/* Inbox & Settings */}
        <SidebarGroup className="py-4">
          <SidebarMenu>
            {bottomNavigation.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <Separator />

      <SidebarFooter>
        <SidebarGroup className="p-4">
          <UserNav />
        </SidebarGroup>
        
        <Separator />
        
        <SidebarFooterRow>
          <SidebarVersion>
            v0.1.0 MVP
          </SidebarVersion>
          <ModeToggle />
        </SidebarFooterRow>
      </SidebarFooter>
    </SidebarContainer>
  );
};
