"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/shared/ui/ui/mode-toggle";
import { UserNav } from "@/shared/ui/layout/user-nav";
import { Button } from "@/shared/ui/ui/button";
import { Separator } from "@/shared/ui/ui/separator";
import {
  Sidebar as SidebarContainer,
  SidebarHeader,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
  SidebarFooterRow,
  SidebarVersion,
} from "@/shared/ui/ui/sidebar";
import { mainNavigation, secondaryNavigation } from "@/shared/config/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

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
          <Image 
            src="/logo-symbol-axon.svg" 
            alt="Axon" 
            width={40} 
            height={40} 
            className="h-10 w-10 dark:invert"
          />
        </SidebarBrand>
      </SidebarHeader>
      
      <Separator />

      <SidebarContent>
        <SidebarGroup className="py-4">
          <SidebarMenu>
            {mainNavigation.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator />

        <SidebarGroup className="py-4">
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            {secondaryNavigation.map((item) => (
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