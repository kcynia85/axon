"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Inbox } from "lucide-react";
import { Sidebar, NavigationItem } from "@/shared/ui/layout/sidebar";
import { ModeToggle } from "@/shared/ui/ui/ModeToggle";
import { InboxDrawer } from "@/modules/inbox/ui/InboxDrawer";
import { UserNav } from "@/shared/ui/layout/UserNav";
import { Button } from "@/shared/ui/ui/Button";
import { useUiStore } from "@/shared/lib/store/useUiStore";
import { useInboxItems } from "@/modules/inbox/application/useInbox";
import { mainNavigation, bottomNavigation } from "@/shared/config/navigation";

type MainLayoutProps = {
  readonly children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): React.ReactNode => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, toggleInbox } = useUiStore();
  const { data: inboxItems } = useInboxItems();

  const unreadCount =
    inboxItems?.filter((item) => item.item_status === "NEW").length ?? 0;

  const mapNavigationToSidebarItems = (
    navItems: typeof mainNavigation
  ): NavigationItem[] =>
    navItems
      .filter((item) => item.name !== "Inbox")
      .map((item) => ({
        ...item,
        badge: undefined,
        onClick: undefined,
        hasCollapseToggle: item.name === "Home",
      }));

  const sidebarItems = mapNavigationToSidebarItems(mainNavigation);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      <Sidebar
        items={sidebarItems}
        bottomItems={bottomNavigation}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        pathname={pathname}
      />
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Actions Bar - Direct on background, no floating island */}
        <div className="absolute top-6 right-8 z-50 flex items-center gap-2">
          <ModeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              toggleInbox();
            }}
            className="rounded-xl h-10 w-10 shrink-0 relative"
          >
            <Inbox className="w-[18px] h-[18px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2 items-center justify-center rounded-full bg-blue-500 border border-white dark:border-black" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-xl h-10 w-10 shrink-0"
          >
            <Link href="/settings">
              <Settings className="w-[18px] h-[18px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" />
            </Link>
          </Button>
          
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <div className="w-auto shrink-0">
            <UserNav hideText={true} />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
      <InboxDrawer />
    </div>
  );
};

export default MainLayout;
